# RedSys Control - Ticket Manager

<p align="center">
  <img src="https://jehskix4eyb3bg1v.public.blob.vercel-storage.com/redsys-logo-8V5Npv24LURA4ytbkcy3xxmeIFGITO.png" width="200" alt="Redsys Control Logo" />
</p>

---

## How to Start on the Project

If you are new to this project, follow these steps to get started:

1. Pull the latest changes from the `develop` branch:
   ```bash
   git pull origin develop
   ```
2. Ask a teammate for the `.env` file and place it in your project's root directory.
3. Install dependencies and start the development server:
   ```bash
   npm install -g pnpm
   pnpm install
   pnpm prisma generate
   pnpm build
   pnpm run dev
   ```
4. Make sure your environment is running at [http://localhost:3000/](http://localhost:3000/).

---

## How to Manage Git (Git Flow)

Follow these steps to work with Git effectively:

1. Switch to the `develop` branch:
   ```bash
   git checkout develop
   ```
2. Always pull the latest changes from `develop` with the `--rebase` flag before coding:
   ```bash
   git pull origin develop --rebase
   ```
3. Create a new branch from `develop`:
   ```bash
   git checkout -b your_new_branch
   ```
   > **Note**: Always pull from `develop` before creating a new branch to ensure it's up-to-date.
4. Add the files you worked on:
   ```bash
   git add .
   ```
5. Commit your changes with a clear and descriptive message:
   ```bash
   git commit -m 'Feature(nameOfFeature): Description of the feature'
   ```
   - Follow [Conventional Commits](https://mokkapps.de/blog/how-to-automatically-generate-a-helpful-changelog-from-your-git-commit-messages/#conventional-commits) for better commit messages.
6. Push your changes to your branch:
   ```bash
   git push origin your_new_branch
   ```
7. Verify that your changes are correctly reflected in the deployment on Vercel.
8. Go to GitHub and create a **Pull Request (PR)** to be reviewed and approved by your Team Lead.
9. Before merging your branch into `develop`, test the production build locally:
   ```bash
   pnpm build
   ```
10. Once approved, merge your branch into `develop` or ask your Team Lead to merge it.
11. Continue working on the same branch if it's related to the same feature/fix, or create a new branch for new features.

---

## Technical Specifications

- **Images**: Using Next.js Images with SVG format.
- **Routing**: Next.js Routing.
- **Next.js Version**: 15.0.4.
- **Styles**: Tailwind CSS.
- **Package Manager**: pnpm.
- **Releases**: Tags created for production (PRD) releases.
- **API**: REST API.
- **Authentication**: NextAuth.js.
- **Database**: PostgreSQL.
- **File Storage**: Vercel Blob.
