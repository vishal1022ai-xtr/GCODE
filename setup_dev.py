#!/usr/bin/env python3
"""
MediMinder AI - Local Development Setup Script

This script automatically sets up and runs the MediMinder AI project on your local machine.
It handles Node.js installation, dependency management, port conflicts, and configuration.

Usage: python setup_dev.py
"""

import subprocess
import platform
import os
import sys
import shutil
import socket
import json
import time
import re
import webbrowser
from pathlib import Path
from typing import Optional, List, Tuple

class Colors:
    """ANSI color codes for terminal output"""
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    BLUE = '\033[94m'
    BOLD = '\033[1m'
    END = '\033[0m'

class DevSetup:
    def __init__(self):
        self.os_name = platform.system().lower()
        self.project_root = Path.cwd()
        self.backup_suffix = f".backup.{int(time.time())}"
        self.preferred_ports = [5173, 5000, 3000, 8080, 4000, 8000]
        self.selected_port = None
        
    def print_status(self, message: str, status: str = "info"):
        """Print colored status messages"""
        color = {
            "success": Colors.GREEN,
            "warning": Colors.YELLOW,
            "error": Colors.RED,
            "info": Colors.BLUE
        }.get(status, Colors.BLUE)
        
        print(f"{color}{Colors.BOLD}[{status.upper()}]{Colors.END} {message}")
    
    def run_command(self, command: List[str], check: bool = True, capture_output: bool = False) -> subprocess.CompletedProcess:
        """Run a shell command with proper error handling"""
        try:
            if capture_output:
                result = subprocess.run(command, capture_output=True, text=True, check=check)
            else:
                result = subprocess.run(command, check=check)
            return result
        except subprocess.CalledProcessError as e:
            if capture_output:
                self.print_status(f"Command failed: {' '.join(command)}", "error")
                self.print_status(f"Error output: {e.stderr}", "error")
            raise
    
    def check_node_version(self) -> Tuple[bool, Optional[str]]:
        """Check if Node.js is installed and meets minimum version requirements"""
        try:
            result = self.run_command(["node", "--version"], capture_output=True)
            version = result.stdout.strip()
            # Extract major version number (e.g., "v20.11.0" -> 20)
            major_version = int(re.search(r'v(\d+)', version).group(1))
            
            if major_version >= 18:
                return True, version
            else:
                self.print_status(f"Node.js version {version} is too old. Need >= 18", "warning")
                return False, version
                
        except (subprocess.CalledProcessError, FileNotFoundError, AttributeError):
            return False, None
    
    def install_node_windows(self):
        """Install Node.js on Windows using available package managers"""
        self.print_status("Attempting to install Node.js on Windows...", "info")
        
        # Try winget first
        try:
            self.run_command(["winget", "install", "OpenJS.NodeJS"])
            self.print_status("Node.js installed via winget", "success")
            return True
        except (subprocess.CalledProcessError, FileNotFoundError):
            pass
        
        # Try chocolatey
        try:
            self.run_command(["choco", "install", "nodejs", "-y"])
            self.print_status("Node.js installed via chocolatey", "success")
            return True
        except (subprocess.CalledProcessError, FileNotFoundError):
            pass
        
        return False
    
    def install_node_macos(self):
        """Install Node.js on macOS using Homebrew"""
        self.print_status("Attempting to install Node.js on macOS...", "info")
        
        try:
            # Check if brew is installed
            self.run_command(["brew", "--version"], capture_output=True)
            self.run_command(["brew", "install", "node"])
            self.print_status("Node.js installed via Homebrew", "success")
            return True
        except (subprocess.CalledProcessError, FileNotFoundError):
            return False
    
    def install_node_linux(self):
        """Install Node.js on Linux using available package managers"""
        self.print_status("Attempting to install Node.js on Linux...", "info")
        
        # Try apt (Ubuntu/Debian)
        try:
            self.run_command(["sudo", "apt", "update"])
            self.run_command(["sudo", "apt", "install", "-y", "nodejs", "npm"])
            self.print_status("Node.js installed via apt", "success")
            return True
        except (subprocess.CalledProcessError, FileNotFoundError):
            pass
        
        # Try dnf (Fedora)
        try:
            self.run_command(["sudo", "dnf", "install", "-y", "nodejs", "npm"])
            self.print_status("Node.js installed via dnf", "success")
            return True
        except (subprocess.CalledProcessError, FileNotFoundError):
            pass
        
        # Try pacman (Arch)
        try:
            self.run_command(["sudo", "pacman", "-S", "--noconfirm", "nodejs", "npm"])
            self.print_status("Node.js installed via pacman", "success")
            return True
        except (subprocess.CalledProcessError, FileNotFoundError):
            pass
        
        return False
    
    def install_node(self):
        """Install Node.js based on the operating system"""
        success = False
        
        if self.os_name == "windows":
            success = self.install_node_windows()
        elif self.os_name == "darwin":
            success = self.install_node_macos()
        elif self.os_name == "linux":
            success = self.install_node_linux()
        
        if not success:
            self.print_status("Automatic Node.js installation failed. Please install manually:", "error")
            print("\nManual installation instructions:")
            print("1. Visit https://nodejs.org/")
            print("2. Download and install Node.js LTS (20.x or later)")
            print("3. Restart your terminal and run this script again")
            sys.exit(1)
    
    def check_npm(self) -> bool:
        """Check if npm is available"""
        try:
            self.run_command(["npm", "--version"], capture_output=True)
            return True
        except (subprocess.CalledProcessError, FileNotFoundError):
            return False
    
    def find_free_port(self, start_port: int = 5173) -> int:
        """Find a free port starting from the given port"""
        for port in self.preferred_ports:
            if port >= start_port:
                if self.is_port_free(port):
                    return port
        
        # If none of the preferred ports are free, find any free port
        for port in range(start_port, start_port + 100):
            if self.is_port_free(port):
                return port
        
        raise RuntimeError("Could not find a free port")
    
    def is_port_free(self, port: int) -> bool:
        """Check if a port is free"""
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.bind(('localhost', port))
                return True
        except OSError:
            return False
    
    def kill_process_on_port(self, port: int) -> bool:
        """Kill process running on the specified port"""
        try:
            if self.os_name == "windows":
                # Find PID using netstat
                result = self.run_command(
                    ["netstat", "-ano", "-p", "TCP"], capture_output=True
                )
                for line in result.stdout.split('\n'):
                    if f":{port}" in line and "LISTENING" in line:
                        pid = line.split()[-1]
                        self.run_command(["taskkill", "/PID", pid, "/F"])
                        return True
            else:
                # Unix-like systems
                result = self.run_command(
                    ["lsof", "-ti", f":{port}"], capture_output=True
                )
                if result.stdout.strip():
                    pid = result.stdout.strip()
                    self.run_command(["kill", "-9", pid])
                    return True
        except subprocess.CalledProcessError:
            pass
        
        return False
    
    def handle_port_conflict(self, port: int) -> int:
        """Handle port conflicts by offering to kill process or use different port"""
        self.print_status(f"Port {port} is already in use", "warning")
        
        while True:
            choice = input(f"Choose an option:\n"
                          f"1. Kill process on port {port}\n"
                          f"2. Use a different port\n"
                          f"3. Exit\n"
                          f"Enter choice (1-3): ").strip()
            
            if choice == "1":
                if self.kill_process_on_port(port):
                    self.print_status(f"Process on port {port} terminated", "success")
                    return port
                else:
                    self.print_status(f"Failed to kill process on port {port}", "error")
                    
            elif choice == "2":
                new_port = self.find_free_port(port + 1)
                self.print_status(f"Using port {new_port} instead", "info")
                return new_port
                
            elif choice == "3":
                self.print_status("Setup cancelled by user", "info")
                sys.exit(0)
            else:
                print("Invalid choice. Please enter 1, 2, or 3.")
    
    def backup_vite_config(self):
        """Create a backup of the current vite.config.ts"""
        vite_config = self.project_root / "vite.config.ts"
        if vite_config.exists():
            backup_path = self.project_root / f"vite.config.ts{self.backup_suffix}"
            shutil.copy2(vite_config, backup_path)
            self.print_status(f"Backup created: {backup_path.name}", "info")
    
    def update_vite_config(self, port: int):
        """Update vite.config.ts for local development"""
        vite_config_path = self.project_root / "vite.config.ts"
        
        if not vite_config_path.exists():
            self.print_status("vite.config.ts not found", "error")
            return False
        
        # Read current config
        with open(vite_config_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check if it already has proper local development configuration
        if 'localhost' in content and f'VITE_PORT || {port}' in content:
            self.print_status("vite.config.ts already configured for local development", "info")
            return True
        
        # Create updated config with environment variable support
        updated_config = f'''import path from 'path';
import {{ defineConfig, loadEnv }} from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({{ mode }}) => {{
    const env = loadEnv(mode, '.', '');
    
    // Detect if running in Replit environment
    const isReplit = process.env.REPL_ID || process.env.REPLIT_DEPLOYMENT;
    
    // Configure for environment-specific settings
    const host = env.VITE_HOST || (isReplit ? '0.0.0.0' : 'localhost');
    const port = Number(env.VITE_PORT || (isReplit ? 5000 : {port}));
    
    return {{
      server: {{
        port: port,
        host: host,
        open: !isReplit, // Only auto-open browser in local development
        allowedHosts: isReplit ? true : undefined,
        strictPort: false, // Allow Vite to try next port if current is busy
        hmr: {{
          port: port,
          ...(isReplit && {{ clientPort: 443 }})
        }},
        cors: true,
        clearScreen: false
      }},
      plugins: [
        react({{
          include: "**/*.{{jsx,tsx,js,ts}}",
        }})
      ],
      define: {{
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY || env.API_KEY || ''),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || env.API_KEY || ''),
        'process.env.NODE_ENV': JSON.stringify(mode)
      }},
      resolve: {{
        alias: {{
          '@': path.resolve(__dirname, '.'),
          '~': path.resolve(__dirname, '.'),
          'src': path.resolve(__dirname, '.'),
        }},
        extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
      }},
      optimizeDeps: {{
        include: [
          'react',
          'react-dom',
          '@google/genai'
        ],
        force: mode === 'development'
      }},
      build: {{
        outDir: 'dist',
        sourcemap: mode === 'development',
        minify: mode === 'production',
        chunkSizeWarningLimit: 1000,
        rollupOptions: {{
          output: {{
            manualChunks: {{
              vendor: ['react', 'react-dom'],
              ai: ['@google/genai']
            }}
          }}
        }}
      }},
      css: {{
        devSourcemap: true
      }},
      envPrefix: ['VITE_', 'GEMINI_'],
      envDir: '.'
    }};
}});
'''
        
        # Write updated config
        with open(vite_config_path, 'w', encoding='utf-8') as f:
            f.write(updated_config)
        
        self.print_status(f"Updated vite.config.ts for localhost:{port}", "success")
        return True
    
    def clear_node_cache(self):
        """Clear npm and node caches that might cause issues"""
        try:
            self.print_status("Clearing npm cache...", "info")
            self.run_command(["npm", "cache", "clean", "--force"], check=False)
            
            # Remove node_modules and package-lock if they exist
            node_modules = self.project_root / "node_modules"
            if node_modules.exists():
                self.print_status("Removing node_modules directory...", "info")
                shutil.rmtree(node_modules)
                
        except Exception as e:
            self.print_status(f"Cache clearing failed: {e}", "warning")

    def check_typescript_config(self):
        """Validate TypeScript configuration for common issues"""
        tsconfig_path = self.project_root / "tsconfig.json"
        if not tsconfig_path.exists():
            self.print_status("tsconfig.json not found", "warning")
            return False
        
        try:
            with open(tsconfig_path, 'r', encoding='utf-8') as f:
                content = f.read()
                
            # Check for common problematic configurations
            if '"moduleResolution": "node"' not in content and '"moduleResolution": "bundler"' not in content:
                self.print_status("TypeScript moduleResolution might need updating", "warning")
                
            self.print_status("TypeScript configuration validated", "success")
            return True
        except Exception as e:
            self.print_status(f"TypeScript config validation failed: {e}", "warning")
            return False

    def install_dependencies(self):
        """Install project dependencies with robust error handling"""
        self.print_status("Installing project dependencies...", "info")
        
        package_lock = self.project_root / "package-lock.json"
        max_retries = 3
        
        for attempt in range(max_retries):
            try:
                if package_lock.exists() and attempt == 0:
                    # Try npm ci first for reproducible builds
                    try:
                        self.run_command(["npm", "ci"])
                        self.print_status("Dependencies installed via npm ci", "success")
                        return
                    except subprocess.CalledProcessError:
                        self.print_status("npm ci failed, trying npm install", "warning")
                
                # Fallback to npm install
                try:
                    cmd = ["npm", "install"]
                    if attempt > 0:
                        cmd.append("--legacy-peer-deps")
                        self.print_status(f"Retry {attempt + 1}/{max_retries} with --legacy-peer-deps", "info")
                    
                    self.run_command(cmd)
                    install_method = "npm install" + (" --legacy-peer-deps" if attempt > 0 else "")
                    self.print_status(f"Dependencies installed via {install_method}", "success")
                    return
                    
                except subprocess.CalledProcessError as e:
                    if attempt < max_retries - 1:
                        self.print_status(f"Installation attempt {attempt + 1} failed, retrying...", "warning")
                        if attempt == 1:  # Clear cache on second retry
                            self.clear_node_cache()
                        continue
                    else:
                        raise e
                        
            except subprocess.CalledProcessError as e:
                if attempt == max_retries - 1:
                    self.print_status("All dependency installation attempts failed", "error")
                    self.print_status("Try the following troubleshooting steps:", "info")
                    print("1. Delete node_modules and package-lock.json")
                    print("2. Run: npm cache clean --force")
                    print("3. Run: npm install")
                    print("4. If issues persist, try: npm install --legacy-peer-deps")
                    sys.exit(1)

    def validate_environment(self):
        """Validate the development environment setup"""
        self.print_status("Validating development environment...", "info")
        
        issues = []
        
        # Check if package.json exists
        if not (self.project_root / "package.json").exists():
            issues.append("package.json not found")
        
        # Check if node_modules exists
        if not (self.project_root / "node_modules").exists():
            issues.append("node_modules directory not found")
        
        # Check TypeScript config
        if not self.check_typescript_config():
            issues.append("TypeScript configuration issues detected")
        
        # Check for common problematic files
        problematic_files = [".npmrc", ".yarnrc"]
        for file in problematic_files:
            if (self.project_root / file).exists():
                issues.append(f"Found {file} which might cause conflicts")
        
        if issues:
            self.print_status("Environment validation issues found:", "warning")
            for issue in issues:
                print(f"  - {issue}")
        else:
            self.print_status("Environment validation passed", "success")
        
        return len(issues) == 0
    
    def start_dev_server(self, port: int):
        """Start the development server"""
        self.print_status(f"Starting development server on http://localhost:{port}", "info")
        
        try:
            # Start the dev server
            env = os.environ.copy()
            env['VITE_PORT'] = str(port)
            env['VITE_HOST'] = 'localhost'
            
            process = subprocess.Popen(
                ["npm", "run", "dev"],
                env=env,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                bufsize=1,
                universal_newlines=True
            )
            
            # Monitor output and open browser when ready
            browser_opened = False
            for line in iter(process.stdout.readline, ''):
                print(line.rstrip())
                
                # Look for the local URL in the output
                if not browser_opened and "Local:" in line and f"localhost:{port}" in line:
                    time.sleep(2)  # Give the server a moment to fully start
                    webbrowser.open(f"http://localhost:{port}")
                    browser_opened = True
                    self.print_status(f"Opened http://localhost:{port} in your browser", "success")
            
            process.wait()
            
        except KeyboardInterrupt:
            self.print_status("Development server stopped by user", "info")
        except subprocess.CalledProcessError:
            self.print_status("Failed to start development server", "error")
            sys.exit(1)
    
    def run_setup(self):
        """Main setup routine"""
        self.print_status("Starting MediMinder AI local development setup", "info")
        print(f"Operating System: {platform.system()} {platform.release()}")
        print(f"Project Directory: {self.project_root}")
        print("-" * 60)
        
        # Step 1: Check Node.js
        self.print_status("Checking Node.js installation...", "info")
        node_ok, node_version = self.check_node_version()
        
        if not node_ok:
            if node_version:
                self.print_status(f"Node.js {node_version} found but version >= 18 required", "warning")
            else:
                self.print_status("Node.js not found", "warning")
            
            self.install_node()
            
            # Re-check after installation
            node_ok, node_version = self.check_node_version()
            if not node_ok:
                self.print_status("Node.js installation verification failed", "error")
                sys.exit(1)
        
        self.print_status(f"Node.js {node_version} is available", "success")
        
        # Check npm
        if not self.check_npm():
            self.print_status("npm not found", "error")
            sys.exit(1)
        
        # Step 2: Find a free port
        self.print_status("Finding available port...", "info")
        desired_port = 5173  # Vite's default
        
        if self.is_port_free(desired_port):
            self.selected_port = desired_port
        else:
            self.selected_port = self.handle_port_conflict(desired_port)
        
        self.print_status(f"Using port {self.selected_port}", "success")
        
        # Step 3: Backup and update Vite config
        self.print_status("Configuring for local development...", "info")
        self.backup_vite_config()
        self.update_vite_config(self.selected_port)
        
        # Step 4: Install dependencies
        self.install_dependencies()
        
        # Step 5: Validate environment
        self.validate_environment()
        
        # Step 6: Start the development server
        self.print_status("Setup complete! Starting development server...", "success")
        print("\nPress Ctrl+C to stop the development server")
        print("-" * 60)
        
        self.start_dev_server(self.selected_port)

def main():
    """Main entry point"""
    try:
        setup = DevSetup()
        setup.run_setup()
    except KeyboardInterrupt:
        print(f"\n{Colors.YELLOW}Setup interrupted by user{Colors.END}")
        sys.exit(0)
    except Exception as e:
        print(f"{Colors.RED}Setup failed with error: {e}{Colors.END}")
        sys.exit(1)

if __name__ == "__main__":
    main()