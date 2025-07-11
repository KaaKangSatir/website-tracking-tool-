
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./hooks/useLanguage";
import Index from "./pages/Index";
import ShortlinkGenerator from "./pages/ShortlinkGenerator";
import ShortlinkRedirect from "./pages/ShortlinkRedirect";
import Dashboard from "./pages/Dashboard";
import ShortcodeDashboard from "./pages/ShortcodeDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/generator" element={<ShortlinkGenerator />} />
            <Route path="/dashboard/shortcode" element={<Dashboard />} />
            <Route path="/dashboard/:shortcode" element={<ShortcodeDashboard />} />
            <Route path="/s/:code" element={<ShortlinkRedirect />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
