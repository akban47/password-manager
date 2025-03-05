# PassVault
PassVault is a zero-knowledge, encrypted password manager built with Next.js 15, TypeScript, and Tailwind CSS. It allows you to securely store and manage your passwords with client-side encryption, ensuring your sensitive data never leaves your browser unencrypted.

## Features
- **Zero-Knowledge Architecture**: All encryption/decryption happens in your browser
- **OAuth Authentication**: Secure login via Google and GitHub
- **Strong Encryption**: AES-256 encryption with CryptoJS
- **Password Generation**: Create strong, unique passwords with configurable options
- **Password Strength Analysis**: Real-time feedback on password security
- **Dark/Light Mode**: Choose your preferred theme
- **Responsive Design**: Works on desktop and mobile devices
- **Intuitive UI**: Easy to use with modern design patterns

## Tech Stack
- **Frontend**: Next.js 15, React 19, TypeScript
- **Authentication**: NextAuth.js with OAuth providers
- **Database**: MongoDB with Prisma ORM
- **Styling**: Tailwind CSS with shadcn/ui components
- **Encryption**: CryptoJS (AES-256)
- **Deployment**: Vercel

## Security
PassVault uses a zero-knowledge architecture which means:

1. All sensitive data is encrypted/decrypted locally in your browser
2. The encryption key is derived from your login credentials
3. The server never sees your unencrypted data
4. Even if the database is compromised, your passwords remain encrypted

Contributions are welcome! Please feel free to submit a Pull Request.

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Disclaimer
This project is a demonstration and educational tool. While it implements security best practices, no software is 100% secure, and you should evaluate its security for your own needs.
