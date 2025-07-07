import { ConfigProvider } from "antd";
import "./App.css";
import Router from "./routes";
import { antdTheme } from "./theme";
import { ToastProvider } from "@components/common/toast";

function App() {
  return (
    <ConfigProvider theme={antdTheme}>
      <ToastProvider />
      <Router />
    </ConfigProvider>
  );
}

export default App;
