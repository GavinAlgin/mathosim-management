import {
	CheckIcon,
	DotIcon,
	MoonIcon,
	PaletteIcon,
	SettingsIcon,
	SunMediumIcon,
	XIcon,
  } from "lucide-react";
  import { useTheme } from "next-themes";
  
  import { Button } from "@/components/ui/button";
  import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
  import { Switch } from "@/components/ui/switch";
  
  import { useCalendar } from "@/components/calendar-context";
  import { useDragDrop } from "@/components/dnd-context";
  
  export function Settings() {
	const {
	  badgeVariant,
	  setBadgeVariant,
	  use24HourFormat,
	  toggleTimeFormat,
	  agendaModeGroupBy,
	  setAgendaModeGroupBy,
	} = useCalendar();
  
	const { showConfirmation, setShowConfirmation } = useDragDrop();
	const { theme, setTheme } = useTheme();
  
	const isDarkMode = theme === "dark";
	const isDotVariant = badgeVariant === "dot";
  
	return (
	  <DropdownMenu>
		<DropdownMenuTrigger asChild>
		  <Button variant="outline" size="icon">
			<SettingsIcon />
		  </Button>
		</DropdownMenuTrigger>
  
		<DropdownMenuContent className="w-56">
		  <DropdownMenuLabel>Calendar settings</DropdownMenuLabel>
		  <DropdownMenuSeparator />
  
		  <DropdownMenuGroup>
			{/* Dark mode */}
			<DropdownMenuItem>
			  <div className="flex items-center gap-2">
				{isDarkMode ? (
				  <MoonIcon className="h-4 w-4" />
				) : (
				  <SunMediumIcon className="h-4 w-4" />
				)}
				Use dark mode
			  </div>
			  <DropdownMenuShortcut>
				<Switch
				  checked={isDarkMode}
				  onCheckedChange={(checked) =>
					setTheme(checked ? "dark" : "light")
				  }
				/>
			  </DropdownMenuShortcut>
			</DropdownMenuItem>
  
			{/* Drag confirmation */}
			<DropdownMenuItem>
			  <div className="flex items-center gap-2">
				{showConfirmation ? (
				  <CheckIcon className="h-4 w-4" />
				) : (
				  <XIcon className="h-4 w-4" />
				)}
				Show confirmation dialog on event drop
			  </div>
			  <DropdownMenuShortcut>
				<Switch
				  checked={showConfirmation}
				  onCheckedChange={setShowConfirmation}
				/>
			  </DropdownMenuShortcut>
			</DropdownMenuItem>
  
			{/* Badge variant */}
			<DropdownMenuItem>
			  <div className="flex items-center gap-2">
				{isDotVariant ? (
				  <DotIcon className="h-4 w-4" />
				) : (
				  <PaletteIcon className="h-4 w-4" />
				)}
				Use dot badge
			  </div>
			  <DropdownMenuShortcut>
				<Switch
				  checked={isDotVariant}
				  onCheckedChange={(checked) =>
					setBadgeVariant(checked ? "dot" : "colored")
				  }
				/>
			  </DropdownMenuShortcut>
			</DropdownMenuItem>
  
			{/* Time format */}
			<DropdownMenuItem>
			  <div className="flex items-center gap-2">
				{use24HourFormat ? (
				  <span className="text-xs font-mono">24h</span>
				) : (
				  <span className="text-xs font-mono">12h</span>
				)}
				Use 24 hour format
			  </div>
			  <DropdownMenuShortcut>
				<Switch
				  checked={use24HourFormat}
				  onCheckedChange={toggleTimeFormat}
				/>
			  </DropdownMenuShortcut>
			</DropdownMenuItem>
		  </DropdownMenuGroup>
  
		  <DropdownMenuSeparator />
  
		  {/* Agenda grouping */}
		  <DropdownMenuGroup>
			<DropdownMenuLabel>Agenda view group by</DropdownMenuLabel>
			<DropdownMenuRadioGroup
			  value={agendaModeGroupBy}
			  onValueChange={(value) =>
				setAgendaModeGroupBy(value as "date" | "color")
			  }
			>
			  <DropdownMenuRadioItem value="date">
				Date
			  </DropdownMenuRadioItem>
			  <DropdownMenuRadioItem value="color">
				Color
			  </DropdownMenuRadioItem>
			</DropdownMenuRadioGroup>
		  </DropdownMenuGroup>
		</DropdownMenuContent>
	  </DropdownMenu>
	);
  }
  