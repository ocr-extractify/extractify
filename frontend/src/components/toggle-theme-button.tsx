import { Button } from "@/components/ui/button";
import { useTheme } from "@/providers/theme-provider";
import { Sun, Moon, Monitor } from "lucide-react";

const ToggleThemeButton = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    switch (theme) {
      case "light":
        setTheme("dark");
        break;
      case "dark":
        setTheme("system");
        break;
      case "system":
        setTheme("light");
        break;
      default:
        setTheme("light");
    }
  };

  const getThemeIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="h-4 w-4" />;
      case "dark":
        return <Moon className="h-4 w-4" />;
      case "system":
        return <Monitor className="h-4 w-4" />;
      default:
        return <Sun className="h-4 w-4" />;
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="h-8 w-8"
      title={`Current theme: ${theme}. Click to change.`}
    >
      {getThemeIcon()}
    </Button>
  );
};

export default ToggleThemeButton;
