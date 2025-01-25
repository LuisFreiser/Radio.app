import { useState, useRef, useEffect } from "react";
import {
  Menu,
  X,
  Pause,
  Play,
  Facebook,
  Youtube,
  Music2,
  MessageCircle,
  Instagram,
} from "lucide-react";

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const maxRetries = 3;
  const audioRef = useRef(null);

  // Agregar estos estados para el slider
  const [currentImage, setCurrentImage] = useState(0);
  const images = [
    "/assets/slider1.jpg",
    "/assets/slider2.jpg",
    "/assets/slider3.jpg",
    "/assets/slider4.jpg",
  ];

  // Efecto para el cambio automático de imágenes
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 10000);

    return () => clearInterval(timer);
  }, [images.length]);

  // // Funciones para controlar el slider
  // const nextImage = () => {
  //   setCurrentImage((prev) => (prev + 1) % images.length);
  // };

  // const prevImage = () => {
  //   setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  // };

  useEffect(() => {
    const audio = audioRef.current;

    const handleError = async (e) => {
      console.error("Error de reproducción:", e);

      if (retryCount < maxRetries) {
        setError("Reintentando conexión...");
        setRetryCount((prev) => prev + 1);

        // Esperar 2 segundos antes de reintentar
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Reintentar reproducción
        try {
          await audio.load();
          await audio.play();
        } catch (error) {
          setError("Error al reproducir la radio");
          setIsLoading(false);
          setIsPlaying(false);
          console.log(error);
        }
      } else {
        setError(
          "No se pudo establecer la conexión después de varios intentos"
        );
        setIsLoading(false);
        setIsPlaying(false);
      }
    };

    const handlePlay = () => {
      setIsLoading(false);
      setIsPlaying(true);
      setError(null);
      setRetryCount(0);
    };

    const handleLoading = () => {
      setIsLoading(true);
      setError(null);
    };

    audio.addEventListener("error", handleError);
    audio.addEventListener("playing", handlePlay);
    audio.addEventListener("waiting", handleLoading);
    audio.addEventListener("stalled", handleError);

    return () => {
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("playing", handlePlay);
      audio.removeEventListener("waiting", handleLoading);
      audio.removeEventListener("stalled", handleError);
    };
  }, [retryCount]);

  const togglePlay = async () => {
    try {
      setError(null);
      setIsLoading(true);

      if (audioRef.current.paused) {
        await audioRef.current.load(); // Recargar el stream antes de reproducir
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          await playPromise;
        }
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Error al reproducir:", err);
      setError("No se pudo reproducir la radio");
      setIsLoading(false);
      setIsPlaying(false);
    }
  };

  const handleVolumeChange = (e) => {
    const value = e.target.value;
    setVolume(value);
    audioRef.current.volume = value;
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="min-h-screen bg-[url('/assets/Fondo5.jpg')] bg-cover bg-center p-4">
      {/* Header with Navigation */}
      <div className="relative z-50">
        {/* Menu Button - Solo visible en móvil */}
        <button
          onClick={toggleMenu}
          className="md:hidden flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 hover:bg-white/30 transition-colors"
        >
          {isMenuOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <Menu className="w-6 h-6 text-white" />
          )}
          <span className="text-white">MENÚ</span>
        </button>

        {/* Mobile Menu */}
        <div
          className={`
          md:hidden fixed inset-0 bg-black/50 backdrop-blur-lg transform transition-transform duration-300 ease-in-out
          ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        >
          {/* Botón de cierre */}
          <button
            onClick={toggleMenu}
            className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-8 h-8 text-white" />
          </button>

          <div className="h-full w-full p-8">
            <div className="flex flex-col space-y-6">
              {/* Program Schedule */}
              <div className=" bg-white/20 backdrop-blur-lg rounded-lg p-6 mt-10 text-white max-w-md">
                <h2 className="text-2xl font-bold mb-6">
                  PROGRAMACIÓN SEMANAL
                </h2>

                {/* Morning Program */}
                <div className="mb-8">
                  <h3 className="text-blue-300 mb-4">Programa Matutino</h3>
                  <div className="flex items-center gap-4">
                    <img
                      src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=150&h=150&fit=crop"
                      alt="Juan"
                      className="w-16 h-16 rounded-full"
                    />
                    <div>
                      <h4 className="font-bold">Despertar con Juan</h4>
                      <p className="text-sm text-gray-300">
                        Lunes a Viernes, 6:00 - 10:00
                      </p>
                      <p className="text-sm text-gray-300">
                        Noticias, tráfico y los éxitos del momento
                      </p>
                    </div>
                  </div>
                </div>

                {/* Midday Program */}
                <div>
                  <h3 className="text-blue-300 mb-4">Programa del Mediodía</h3>
                  <div className="flex items-center gap-4">
                    <img
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop"
                      alt="Maria"
                      className="w-16 h-16 rounded-full"
                    />
                    <div>
                      <h4 className="font-bold">Conexión Maria</h4>
                      <p className="text-sm text-gray-300">
                        Lunes a Viernes, 10:00 - 14:00
                      </p>
                      <p className="text-sm text-gray-300">
                        Música latina y entrevistas exclusivas
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Social Links */}
            <div className="mt-8">
              <div className="flex justify-center space-x-6">
                <a href="#" className="text-white hover:text-purple-300">
                  <Facebook className="w-6 h-6" />
                </a>
                <a href="#" className="text-white hover:text-purple-300">
                  <Youtube className="w-6 h-6" />
                </a>
                <a href="#" className="text-white hover:text-purple-300">
                  <Instagram className="w-6 h-6" />
                </a>
                <a href="#" className="text-white hover:text-purple-300">
                  <MessageCircle className="w-6 h-6" /> {/* Cambiado aquí */}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mt-8 flex flex-col md:flex-row gap-8">
        {/* Program Schedule - Hidden on mobile */}
        <div className="hidden md:block bg-white/20 backdrop-blur-lg rounded-lg p-6 text-white max-w-md">
          <h2 className="text-2xl font-bold mb-6">PROGRAMACIÓN SEMANAL</h2>

          {/* Morning Program */}
          <div className="mb-8">
            <h3 className="text-blue-300 mb-4">Programa Matutino</h3>
            <div className="flex items-center gap-4">
              <img
                src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=150&h=150&fit=crop"
                alt="Juan"
                className="w-16 h-16 rounded-full"
              />
              <div>
                <h4 className="font-bold">Despertar con Juan</h4>
                <p className="text-sm text-gray-300">
                  Lunes a Viernes, 6:00 - 10:00
                </p>
                <p className="text-sm text-gray-300">
                  Noticias, tráfico y los éxitos del momento
                </p>
              </div>
            </div>
          </div>

          {/* Midday Program */}
          <div>
            <h3 className="text-blue-300 mb-4">Programa del Mediodía</h3>
            <div className="flex items-center gap-4">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop"
                alt="Maria"
                className="w-16 h-16 rounded-full"
              />
              <div>
                <h4 className="font-bold">Conexión Maria</h4>
                <p className="text-sm text-gray-300">
                  Lunes a Viernes, 10:00 - 14:00
                </p>
                <p className="text-sm text-gray-300">
                  Música latina y entrevistas exclusivas
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Player Section */}
        <div className="flex-1 flex flex-col items-center justify-center text-white md:pr-28">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">
              Radio Antorcha Encendida
            </h1>
            <p className="text-lg text-gray-200">
              Una Señal de los Ultimos Tiempos
            </p>
          </div>

          <audio
            ref={audioRef}
            src="/api/radio"
            preload="none"
            crossOrigin="anonymous"
          />

          {error && (
            <div className="text-red-500 text-center text-sm mb-4">{error}</div>
          )}

          {/* Album Art and Player */}
          <div className=" bg-white/10 backdrop-blur-lg mb-8 p-4 rounded-2xl overflow-hidden">
            <div className="flex justify-center items-center h-32 mb-2 mt-2">
              <img
                src="/assets/Logo2.jpg"
                alt="Now Playing"
                className="w-32 h-32 rounded-lg shadow-lg mb-4"
              />
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-4">
                <button
                  onClick={togglePlay}
                  disabled={isLoading}
                  className="bg-white rounded-full p-3"
                >
                  {isLoading ? (
                    <svg
                      className="animate-spin h-6 w-6 text-purple-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : isPlaying ? (
                    <Pause className="w-6 h-6 text-purple-600" />
                  ) : (
                    <Play className="w-6 h-6 text-purple-600" />
                  )}
                </button>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    isPlaying ? "bg-green-500" : "bg-gray-500"
                  }`}
                >
                  {isPlaying ? "Online" : "Offline"}
                </span>
              </div>

              {/* Volume Control */}
              <div className="mt-4 flex items-center gap-2 w-64">
                <Music2 className="w-5 h-5 text-white" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-full h-2 bg-white/30 rounded-full appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Store Links */}
          <div className="flex gap-4">
            <button className="bg-white/10 hover:bg-white/20 transition px-6 py-2 rounded-lg flex items-center gap-2">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/1200px-Google_Play_Store_badge_EN.svg.png"
                alt="Play Store"
                className="h-5"
              />
            </button>
            <button className="bg-white/10 hover:bg-white/20 transition px-6 py-2 rounded-lg flex items-center gap-2">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Download_on_the_App_Store_Badge.svg/1200px-Download_on_the_App_Store_Badge.svg.png"
                alt="App Store"
                className="h-5"
              />
            </button>
          </div>
        </div>

        {/* Social Media Links - Desktop only */}
        <div className="hidden md:flex fixed right-4 top-1/2 -translate-y-1/2 flex-col gap-4">
          <a
            href="#"
            className="bg-white/10 p-3 rounded-lg hover:bg-white/20 transition"
          >
            <Facebook className="w-6 h-6 text-white" />
          </a>
          <a
            href="#"
            className="bg-white/10 p-3 rounded-lg hover:bg-white/20 transition"
          >
            <Youtube className="w-6 h-6 text-white" />
          </a>
          <a
            href="#"
            className="bg-white/10 p-3 rounded-lg hover:bg-white/20 transition"
          >
            <Music2 className="w-6 h-6 text-white" />
          </a>
          <a
            href="#"
            className="bg-white/10 p-3 rounded-lg hover:bg-white/20 transition"
          >
            <MessageCircle className="w-6 h-6 text-white" />
          </a>
        </div>

        {/* Mobile Social Links - Fixed Bottom */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent backdrop-blur-sm">
          <div className="flex justify-center space-x-8">
            <a
              href="#"
              className="text-white hover:text-white-300 transform hover:scale-110 transition-all"
            >
              <Facebook className="w-8 h-8" />
            </a>
            <a
              href="#"
              className="text-white hover:text-white-300 transform hover:scale-110 transition-all"
            >
              <Youtube className="w-8 h-8" />
            </a>
            <a
              href="#"
              className="text-white hover:text-white-300 transform hover:scale-110 transition-all"
            >
              <Music2 className="w-8 h-8" />
            </a>
            <a
              href="#"
              className="text-white hover:text-white-300 transform hover:scale-110 transition-all"
            >
              <MessageCircle className="w-8 h-8" />
            </a>
          </div>
        </div>
      </div>

      {/* Slider Section - Antes del cierre del div principal */}
      <div className="w-full max-w-[900px] mx-auto mt-6 mb-8 md:pt-16 relative">
        <div className="relative w-full h-[100px] md:h-[150px] overflow-hidden rounded-xl">
          {images.map((img, index) => (
            <div
              key={index}
              className={`absolute w-full h-full transition-all duration-500 ease-in-out transform ${
                index === currentImage
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-full"
              }`}
            >
              <img
                src={img}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}

          {/* Controles del slider */}
          {/* <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white rounded-full p-2 transition-all"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white rounded-full p-2 transition-all"
          >
            <ChevronRight className="w-6 h-6" />
          </button> */}

          {/* Indicadores */}
          {/* <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImage(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentImage ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default App;
