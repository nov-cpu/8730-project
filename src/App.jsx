import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import ScrollToTop from './components/ScrollToTop';
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import Favorites from "@/pages/Favorites";
import Compare from "@/pages/Compare";
// Simplified QueryClient for offline use
const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false, retry: 1 } },
});
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Changed to HashRouter which is required for GitHub Pages to handle routing correctly */}
      <Router>
        <ScrollToTop />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/compare" element={<Compare />} />
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </QueryClientProvider>
  )
}
export default App;