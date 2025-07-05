"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { BookOpen, CheckSquare, Coins, AlertTriangle, Trophy, Settings, LogOut, Sun, Moon } from "lucide-react"
import { LanguageToggle } from "@/components/ui/language-toggle"
import { useTranslation } from "@/lib/i18n"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import type { User } from "@/types"

interface AppSidebarProps {
  user: User
  onLanguageChange: (language: "en" | "sw") => void
  isDarkMode: boolean
  onThemeToggle: () => void
}

export function AppSidebar({ user, onLanguageChange, isDarkMode, onThemeToggle }: AppSidebarProps) {
  const pathname = usePathname()
  const language = user.language === "en" || user.language === "sw" ? user.language : "en"
  const { t } = useTranslation(language)
  const { logout } = useAuth()
  const router = useRouter()

  const navigationItems = [
    {
      title: t("learn" as any),
      url: "/dashboard/learn",
      icon: BookOpen,
    },
    {
      title: t("tasks" as any),
      url: "/dashboard/tasks",
      icon: CheckSquare,
    },
    {
      title: t("tokens" as any),
      url: "/dashboard/tokens",
      icon: Coins,
    },
    {
      title: t("emergency" as any),
      url: "/dashboard/emergency",
      icon: AlertTriangle,
    },
    {
      title: t("leaderboard" as any),
      url: "/dashboard/leaderboard",
      icon: Trophy,
    },
  ]

  const handleSignOut = () => {
    logout()
    router.push("/")
  }

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-4">
          <Avatar className="w-12 h-12">
            <AvatarFallback className="text-xl font-semibold">{user.phone.slice(-2)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-semibold text-lg">{user.phone}</p>
            <p className="text-sm text-muted-foreground">{user.county}</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <item.icon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                      <span className="text-base font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 space-y-3">
        <div className="flex items-center gap-3">
          <LanguageToggle currentLanguage={user.language} userId={user.id} onLanguageChange={onLanguageChange} />
          <Button variant="outline" size="sm" onClick={onThemeToggle} className="p-2">
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>

        <Link href="/dashboard/settings" passHref legacyBehavior>
          <a className="w-full justify-start flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors inline-flex">
            <Settings className="h-5 w-5" />
            <span className="text-base font-medium">Settings</span>
          </a>
        </Link>

        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-red-600 flex items-center gap-2 px-3 py-2 rounded-md hover:bg-red-100 dark:hover:bg-red-700 transition-colors"
          onClick={handleSignOut}
        >
          <LogOut className="h-5 w-5" />
          <span className="text-base font-medium">Sign Out</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
