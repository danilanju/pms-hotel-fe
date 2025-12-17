// src/index.js (KODE YANG BENAR)

import React from "react";
import ReactDOM from "react-dom/client";
// 1. Impor Provider dari react-redux
import { Provider } from "react-redux";
// 2. Impor store yang sudah kita konfigurasi
import { store } from "./app/store";
import "./index.css"; // Pastikan baris ini ada
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* 3. Bungkus komponen <App /> dengan <Provider> dan berikan prop 'store' */}
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
