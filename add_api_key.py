#!/usr/bin/env python3
"""
Simple script to add Gemini API key to MediMinder AI project
Usage: python add_api_key.py
"""

import os
from pathlib import Path

def main():
    """Add or update Gemini API key"""
    project_root = Path.cwd()
    env_file = project_root / ".env"
    
    print("=" * 60)
    print("🤖 MediMinder AI - API Key Setup")
    print("=" * 60)
    
    # Check if API key already exists
    existing_key = None
    if env_file.exists():
        try:
            with open(env_file, 'r', encoding='utf-8') as f:
                content = f.read()
                for line in content.split('\n'):
                    if line.startswith('GEMINI_API_KEY=') and line != 'GEMINI_API_KEY=':
                        existing_key = line.split('=', 1)[1].strip()
                        break
        except Exception:
            pass
    
    if existing_key:
        print(f"✅ API key already set: {existing_key[:8]}...")
        choice = input("\nWould you like to update it? (y/n): ").strip().lower()
        if choice not in ['y', 'yes']:
            print("No changes made.")
            return
    
    print("\nTo enable AI chat functionality, you need a free Gemini API key.")
    print("\nHow to get your API key:")
    print("1. Visit: https://aistudio.google.com/app/apikey")
    print("2. Sign in with your Google account")
    print("3. Click 'Create API Key'")
    print("4. Copy the generated key")
    
    # Get API key from user
    while True:
        api_key = input("\nPaste your Gemini API key here (or 'cancel' to exit): ").strip()
        
        if api_key.lower() == 'cancel':
            print("Setup cancelled.")
            return
        
        if not api_key:
            print("❌ No API key entered. Please try again.")
            continue
        
        if len(api_key) < 10:
            print("❌ API key seems too short. Please check and try again.")
            continue
        
        break
    
    # Save to .env file
    try:
        env_content = f"# Gemini AI API Key for chat functionality\nGEMINI_API_KEY={api_key}\n"
        
        # Preserve existing content if .env exists
        if env_file.exists():
            with open(env_file, 'r', encoding='utf-8') as f:
                existing_content = f.read()
            
            # Remove any existing GEMINI_API_KEY lines
            lines = existing_content.split('\n')
            filtered_lines = [line for line in lines if not line.startswith('GEMINI_API_KEY=')]
            if filtered_lines and filtered_lines[-1].strip():
                env_content = '\n'.join(filtered_lines) + '\n\n' + env_content
            else:
                env_content = '\n'.join(filtered_lines).strip() + '\n\n' + env_content
        
        with open(env_file, 'w', encoding='utf-8') as f:
            f.write(env_content)
        
        print(f"\n✅ API key saved to .env file successfully!")
        print("🎉 AI chat functionality is now available in your app!")
        
        # Add to gitignore if it doesn't exist
        gitignore_file = project_root / ".gitignore"
        if gitignore_file.exists():
            with open(gitignore_file, 'r', encoding='utf-8') as f:
                gitignore_content = f.read()
            
            if '.env' not in gitignore_content:
                with open(gitignore_file, 'a', encoding='utf-8') as f:
                    f.write('\n# Environment variables\n.env\n')
                print("📝 Added .env to .gitignore for security")
        else:
            with open(gitignore_file, 'w', encoding='utf-8') as f:
                f.write('# Environment variables\n.env\n')
            print("📝 Created .gitignore and added .env for security")
        
        print("\n🔄 Restart your development server to apply changes.")
        
    except Exception as e:
        print(f"❌ Failed to save API key: {e}")
        return

if __name__ == "__main__":
    main()