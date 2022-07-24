
use std::{time::Instant, net::TcpStream};
use std::io::Read;

#[tauri::command]
pub async fn ping(server: String) -> Result<String, String> {
    let start = Instant::now();
    println!("Pinging {}", &server);
    let mut tcp = match TcpStream::connect(&server) {
        Ok(tcp) => {
            println!("Connected to {}", &server);
            tcp
        },
        Err(e) => return Err(e.to_string()),
    };
    let mut buf = [0; 1024];
    match tcp.read(&mut buf) {
        Ok(_) => {
            println!("Received response from {}", &server);
        },
        Err(e) => return Err(e.to_string()),
    };
    let end = Instant::now();
    Ok(format!("{}", end.duration_since(start).as_millis()))
}

#[tauri::command]
pub fn sleep(ms: u64) -> Result<String, String> {
    println!("Sleeping for {} ms", &ms);
    std::thread::sleep(std::time::Duration::from_millis(ms));
    Ok("Success".to_string())
}