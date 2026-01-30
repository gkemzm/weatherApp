import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HomePage } from "../../pages/home";
import { WeatherDetailPage } from "../../pages/weatherDetail/ui/detail";

export function AppRouter() {
  return (
    <BrowserRouter>
      <div className="flex justify-center">
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />

          <Route path="/home" element={<HomePage />} />

          <Route path="*" element={<div>Not Found</div>} />

          <Route path="/weather" element={<WeatherDetailPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
