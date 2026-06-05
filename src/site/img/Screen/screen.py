import tkinter as tk
from tkinter import messagebox
import threading
import cv2
import numpy as np
import mss
import os
import time
import pyautogui
import subprocess
import webbrowser
from pynput import mouse, keyboard
import queue

fps = 20.0
is_recording = False
is_paused = False
cursor_size = 30 
click_color = None
pressed_keys = set()
combo_keys = {"CTRL", "SHIFT", "ALT"}
save_directory = r"C:\Users\josep\Videos\Screen Recorder"
recording_start_time = None
frame_queue = queue.Queue()  # Shared queue for frames

if not os.path.exists(save_directory):
    os.makedirs(save_directory)

def get_unique_filename():
    count = 1
    while os.path.exists(f"{save_directory}/Recorded {count}.mp4"):
        count += 1
    return f"{save_directory}/Recorded {count}.mp4"

def on_click(x, y, button, pressed):
    global click_color
    if pressed:
        click_color = (0, 0, 255) if button == mouse.Button.left else (255, 0, 0)
    else:
        click_color = None

mouse.Listener(on_click=on_click).start()

def on_press(key):
    try:
        key_str = key.char.upper() if hasattr(key, 'char') and key.char else key.name.upper()
        pressed_keys.add(key_str)
    except:
        pass

def on_release(key):
    try:
        key_str = key.char.upper() if hasattr(key, 'char') and key.char else key.name.upper()
        pressed_keys.discard(key_str)
    except:
        pass

keyboard.Listener(on_press=on_press, on_release=on_release).start()

def valid_key_combo():
    return any(k in pressed_keys for k in combo_keys) and len(pressed_keys) > 1

def open_folder():
    if os.name == 'nt': 
        subprocess.run(["explorer", save_directory], shell=True)
    elif os.name == 'posix':
        subprocess.run(["xdg-open", save_directory])

def update_timer():
    while is_recording:
        if recording_start_time is not None and not is_paused: 
            elapsed_time = int(time.time() - recording_start_time)
            m, s = divmod(elapsed_time, 60)
            timer_label.config(text=f"Time: {m:02d}:{s:02d}")
        time.sleep(1)

def start_recording():
    global is_recording, recording_start_time, is_paused
    if is_recording:
        return
    is_recording = True
    is_paused = False
    recording_start_time = time.time()
    update_ui()
    root.iconify()
    threading.Thread(target=capture_frames, daemon=True).start()
    threading.Thread(target=write_frames, daemon=True).start()
    threading.Thread(target=update_timer, daemon=True).start()

def stop_recording():
    global is_recording, is_paused
    if not is_recording:
        return
    is_recording = False
    is_paused = False
    frame_queue.put(None)  # Signal to stop writing
    timer_label.config(text="Time: 00:00")
    update_ui()
    root.deiconify()

def toggle_pause_resume():
    global is_paused
    if not is_recording:
        return
    is_paused = not is_paused
    if is_paused:
        status_label.config(text="Paused", fg="yellow")
        pause_resume_btn.config(text="▶ Resume")
    else:
        status_label.config(text="Recording...", fg="#FF5733")
        pause_resume_btn.config(text="⏸ Pause")

def exit_program():
    if is_recording:
        messagebox.showerror("Error", "Stop recording before exiting!")
        return
    root.quit()

def capture_frames():
    with mss.mss() as sct:
        screen_size = sct.monitors[1]["width"], sct.monitors[1]["height"]
        frame_duration = 1.0 / fps
        start_time = time.perf_counter()
        frame_count = 0
        while is_recording:
            if is_paused:
                time.sleep(0.1)
                continue
            target_time = start_time + frame_count * frame_duration
            now = time.perf_counter()
            if now < target_time:
                time.sleep(target_time - now)
            try:
                screenshot = sct.grab(sct.monitors[1])
                frame = np.array(screenshot)
                frame = cv2.cvtColor(frame, cv2.COLOR_BGRA2BGR)
                mouse_x, mouse_y = pyautogui.position()
                overlay = frame.copy()
                cv2.circle(overlay, (mouse_x, mouse_y), cursor_size, (0, 255, 255), -1)
                frame = cv2.addWeighted(overlay, 0.2, frame, 0.8, 0)
                cv2.circle(frame, (mouse_x, mouse_y), 5, (0, 0, 255), -1)
                if click_color:
                    cv2.circle(frame, (mouse_x, mouse_y), 15, click_color, 2)
                if valid_key_combo():
                    keys_text = " + ".join(sorted(pressed_keys))
                    cv2.putText(frame, f"Keys: {keys_text}", (20, screen_size[1] - 50),
                                cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2, cv2.LINE_AA)
                frame_queue.put(frame)
                frame_count += 1
            except Exception as e:
                print(f"Error capturing frame: {e}")
                continue

def write_frames():
    filename = get_unique_filename()
    with mss.mss() as sct:
        screen_size = sct.monitors[1]["width"], sct.monitors[1]["height"]
        fourcc = cv2.VideoWriter_fourcc(*"mp4v")
        out = cv2.VideoWriter(filename, fourcc, fps, screen_size)
        if not out.isOpened():
            print("Error: Could not open VideoWriter")
            return
        while is_recording:
            try:
                frame = frame_queue.get(timeout=1)
                if frame is None:
                    break
                out.write(frame)
            except queue.Empty:
                continue
            except Exception as e:
                print(f"Error writing frame: {e}")
                continue
        out.release()
        print(f"Video saved: {filename}")
        root.after(0, lambda: recording_saved_message(filename))

def recording_saved_message(filename):
    saved_label.config(text=f"Saved: {os.path.basename(filename)}")
    open_folder_btn.pack(pady=5)

def update_ui():
    if is_recording:
        status_label.config(text="Recording...", fg="#FF5733")
        start_btn.config(state="disabled")
        stop_btn.config(state="normal")
        pause_resume_btn.config(state="normal", text="⏸ Pause")
        exit_btn.config(state="disabled")
    else:
        status_label.config(text="Stopped", fg="white")
        start_btn.config(state="normal")
        stop_btn.config(state="disabled")
        pause_resume_btn.config(state="disabled")
        exit_btn.config(state="normal")

root = tk.Tk()
root.title("Screen Recorder")
try:
    root.iconbitmap("icon.ico")
except tk.TclError:
    pass

root.geometry("370x400")
root.configure(bg="#1E1E1E")

button_style = {"font": ("Arial", 14), "fg": "white", "bg": "#3A3A3A", "bd": 2, "relief": "groove"}

status_label = tk.Label(root, text="Start Recording", font=("Arial", 14), fg="white", bg="#1E1E1E")
status_label.pack(pady=10)

timer_label = tk.Label(root, text="Time: 00:00", font=("Arial", 12), fg="white", bg="#1E1E1E")
timer_label.pack(pady=5)

start_btn = tk.Button(root, text="▶ Start Recording", command=start_recording, **button_style)
start_btn.pack(pady=5)

stop_btn = tk.Button(root, text="■ Stop Recording", command=stop_recording, **button_style, state="disabled")
stop_btn.pack(pady=5)

pause_resume_btn = tk.Button(root, text="⏸ Pause", command=toggle_pause_resume, **button_style, state="disabled")
pause_resume_btn.pack(pady=5)

saved_label = tk.Label(root, text="", font=("Arial", 10), fg="lightgreen", bg="#1E1E1E")
saved_label.pack(pady=5)

open_folder_btn = tk.Button(root, text="📂 Open Folder (See Your Recorded Videos)", font=("Arial", 10), fg="white", bg="#3A3A3A", bd=2,
                            relief="groove", command=open_folder)
open_folder_btn.pack_forget()

exit_btn = tk.Button(root, text="❌ Exit", command=exit_program, **button_style)
exit_btn.pack(pady=10)

def open_website(event):
    webbrowser.open("https://cosname.web.app/")

copyright_label = tk.Label(
    root,
    text="© Cosname Technologies - Visit: https://cosname.web.app/",
    fg="gray",
    font=("Arial", 9),
    cursor="hand2",
)
copyright_label.pack(side=tk.BOTTOM, pady=5)
copyright_label.bind("<Button-1>", open_website)

root.mainloop()