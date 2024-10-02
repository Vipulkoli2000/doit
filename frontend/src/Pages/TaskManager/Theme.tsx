// components/ThemeSwitchButton.jsx
import { useTheme } from "@/darktheme/CustomTheme"; // Adjust the path to your CustomTheme
import {Button} from "@/components/ui/button";

const ThemeSwitchButton = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      onClick={toggleTheme}
      className="p-2 bg-gray-200 dark:bg-gray-800 rounded-md"
    >
      {theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
    </Button>
  );
};

export default ThemeSwitchButton;
