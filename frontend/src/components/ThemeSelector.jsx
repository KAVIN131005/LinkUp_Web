import { PaletteIcon } from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";
import { THEMES } from "../constants";

const ThemeSelector = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="dropdown dropdown-end">
      {/* DROPDOWN TRIGGER */}
      <button 
        tabIndex={0} 
        className="btn btn-ghost btn-circle btn-lg hover:bg-primary/10 hover:scale-110 transition-all duration-300 group"
        title="Choose Theme"
      >
        <PaletteIcon className="size-6 group-hover:text-primary transition-colors duration-200" />
      </button>

      <div
        tabIndex={0}
        className="dropdown-content mt-3 p-2 shadow-2xl bg-base-100/90 backdrop-blur-xl rounded-3xl border border-base-content/10 w-72 max-h-96 overflow-y-auto scrollbar-thin"
      >
        <div className="p-3 border-b border-base-content/10 mb-2">
          <h3 className="font-bold text-lg text-base-content flex items-center gap-2">
            <PaletteIcon className="size-5 text-primary" />
            Choose Your Theme
          </h3>
          <p className="text-sm text-base-content/60 mt-1">Pick a style that inspires you</p>
        </div>
        
        <div className="space-y-1">
          {THEMES.map((themeOption) => (
            <button
              key={themeOption.name}
              className={`group w-full px-4 py-4 rounded-2xl flex items-center gap-4 transition-all duration-300 hover:scale-[1.02] ${
                theme === themeOption.name
                  ? "bg-gradient-to-r from-primary/20 to-secondary/20 text-primary border border-primary/30 shadow-lg shadow-primary/10"
                  : "hover:bg-base-content/5 hover:shadow-md"
              }`}
              onClick={() => setTheme(themeOption.name)}
            >
              <div className="flex items-center gap-3 flex-1">
                <div className={`p-2 rounded-xl transition-all duration-300 ${
                  theme === themeOption.name 
                    ? "bg-primary/20 group-hover:bg-primary/30" 
                    : "bg-base-content/10 group-hover:bg-base-content/20"
                }`}>
                  <PaletteIcon className={`size-4 ${
                    theme === themeOption.name ? "text-primary" : "text-base-content/70"
                  }`} />
                </div>
                <span className={`font-semibold ${
                  theme === themeOption.name ? "text-primary" : "text-base-content"
                }`}>
                  {themeOption.label}
                </span>
              </div>
              
              {/* THEME PREVIEW COLORS */}
              <div className="flex gap-1">
                {themeOption.colors.map((color, i) => (
                  <div
                    key={i}
                    className={`size-3 rounded-full ring-1 ring-white/20 transition-transform duration-200 ${
                      theme === themeOption.name ? "scale-110" : "group-hover:scale-105"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              
              {/* Selection Indicator */}
              {theme === themeOption.name && (
                <div className="text-primary animate-pulse">
                  ✓
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
export default ThemeSelector;
