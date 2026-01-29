use std::fs::File;
use std::io::{Read, Seek, SeekFrom};
use std::path::PathBuf;
use tauri::Manager;
use urlencoding::decode;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .register_uri_scheme_protocol("media", move |_ctx, request| {
            let uri = request.uri().to_string();
            let path_str = uri.strip_prefix("media://localhost/").unwrap_or(&uri);
            let path_decoded = decode(path_str).expect("UTF-8").to_string();
            let path = PathBuf::from(path_decoded);

            if !path.exists() {
                return tauri::http::Response::builder()
                    .status(404)
                    .body(Vec::new())
                    .unwrap();
            }

            // Simple handling for now (seeking support needed for proper video)
            // But first let's just get it to stream whole file.
            // Vidstack/Browser WILL request Range headers.
            // Implementing basic Range support.

            let mut file = File::open(&path).unwrap();
            let len = file.metadata().unwrap().len();

            let mut status_code = 200;
            let mut start = 0;
            let mut end = len - 1;

            if let Some(range_header) = request.headers().get("Range") {
                let range_str = range_header.to_str().unwrap();
                // Parse "bytes=START-END"
                if let Some(range_val) = range_str.strip_prefix("bytes=") {
                    let parts: Vec<&str> = range_val.split('-').collect();
                    if let Some(s) = parts.get(0).and_then(|s| s.parse::<u64>().ok()) {
                        start = s;
                    }
                    if let Some(e) = parts.get(1).and_then(|s| s.parse::<u64>().ok()) {
                        end = e;
                    } else {
                        // if end is missing, end implies len - 1
                        end = len - 1;
                    }

                    if start > end {
                        start = end;
                    }

                    status_code = 206;
                }
            }

            file.seek(SeekFrom::Start(start)).unwrap();
            let mut buffer = vec![0; (end - start + 1) as usize];
            file.read_exact(&mut buffer).unwrap();

            let mime = mime_guess::from_path(&path).first_or_octet_stream();

            tauri::http::Response::builder()
                .status(status_code)
                .header("Content-Type", mime.as_ref())
                .header("Content-Length", buffer.len())
                .header("Content-Range", format!("bytes {}-{}/{}", start, end, len))
                .header("Access-Control-Allow-Origin", "*")
                .body(buffer)
                .unwrap()
        })
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
