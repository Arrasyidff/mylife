"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function LoginForm() {
  return (
    <main className="grow flex items-center justify-center px-4 pt-20 pb-16">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-primary text-primary-foreground rounded-xl mb-5 shadow-md">
            <span className="material-symbols-outlined text-xl">track_changes</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-1.5">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            Sign in to your account to continue
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl shadow-sm p-8">
          <form className="space-y-5">
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-sm font-medium text-foreground"
              >
                Email Address
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-[18px] pointer-events-none z-10">
                  mail
                </span>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@company.com"
                  className="pl-8 h-10"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-foreground"
                >
                  Password
                </label>
                <a
                  href="#"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-[18px] pointer-events-none z-10">
                  lock
                </span>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-8 h-10"
                />
              </div>
            </div>

            <Button type="submit" className="w-full h-10 gap-2 mt-1">
              Sign In
              <span className="material-symbols-outlined text-[18px]">
                arrow_forward
              </span>
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-card px-3 text-xs text-muted-foreground">
                or continue with
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            type="button"
            className="w-full h-10 gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">key</span>
            Sign in with SSO
          </Button>
        </div>

        <div className="mt-6 flex flex-col items-center gap-1.5 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm">
              verified_user
            </span>
            AES-256 Bit Encryption
          </div>
          <p>System v2.4.1 Active &amp; Monitored</p>
        </div>
      </div>
    </main>
  )
}
