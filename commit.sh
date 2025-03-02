# commit-commands.sh
#!/bin/bash

# Stage all modified and new files
git add .

# Commit with structured message
git commit -m "feat(auth): implement enhanced authentication flow

- Add email verification handling in verify page
- Improve session management in login/register flows
- Update middleware for proper auth state redirection
- Add API endpoints for session management (signin/signout)

refactor(navbar): modularize navbar components

- Split Navbar into smaller reusable components:
  - BrandLogo, NavbarActions, UserProfilePopover
  - ProfileContent, ProfileDetails, UserAvatar
  - NotificationsButton, GitHubLink, SignOutButton
  - UpgradeCard, ProfileLink components
- Implement skeleton loading states for auth checks

chore(deps): update package dependencies

- Add required dependencies for UI components and auth flow
- Update existing packages to maintain compatibility

docs(ui): add new UI components

- Create Popover and Skeleton components
- Add earth and profile placeholder images"

# Push changes after pulling latest version
git pull origin main
git push origin main
