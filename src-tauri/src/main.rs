// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
#![windows_subsystem = "windows"]

#[tauri::command]
async fn toggle_light(endpoint: String) -> Result<String, String> {
    let client = reqwest::Client::new();
    let response = client
        .get(&endpoint)
        .send()
        .await
        .map_err(|e| e.to_string())?;

    if response.status().is_success() {
        Ok(response.text().await.unwrap_or_else(|_| "Success".into()))
    } else {
        Err(format!("Failed with status: {}", response.status()))
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![toggle_light])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
