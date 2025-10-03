"use client";

import React from 'react';

const Privacy = () => {
  return (
    <>
     
      <div className="min-h-screen  dark:text-gray-100 transition-colors duration-200">
        <header className="max-w-6xl mx-auto p-6 flex items-center justify-between">
          <a href="/">
            <a className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-gradient-to-br from-indigo-600 to-pink-500 flex items-center justify-center text-white font-bold">K</div>
              <span className="font-semibold text-lg">Key-N-Share</span>
            </a>
          </a>
          <nav>
            <a href="/terms-and-conditions">
              <a className="text-sm hover:underline">Terms &amp; Conditions</a>
            </a>
          </nav>
        </header>

        <main className="max-w-4xl mx-auto p-6  rounded-2xl shadow-lg">
          <h1 className="text-3xl font-extrabold mb-4">Privacy Policy</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">Last updated: October 3, 2025</p>

          <section className="prose prose-md dark:prose-invert max-w-none">
            <h2>Introduction</h2>
            <p>
              Welcome to Key-N-Share. This Privacy Policy explains how we collect, use, disclose,
              and protect your personal information when you use our website and services.
            </p>

            <h2>Information We Collect</h2>
            <ul>
              <li><strong>Account Information:</strong> name, email, and profile details when you register.</li>
              <li><strong>Wallet Information:</strong> public wallet addresses and on-chain transaction metadata (we do NOT store private keys).</li>
              <li><strong>Transaction Records:</strong> purchase records, on-chain CIDs, and hashes required to verify dataset authenticity.</li>
              <li><strong>Usage Data:</strong> analytics and logs for improving the service.</li>
            </ul>

            <h2>How We Use Your Data</h2>
            <p>We use collected data to:</p>
            <ul>
              <li>Provide, maintain, and improve the marketplace.</li>
              <li>Process purchases, send delivery keys (asymmetrically encrypted), and verify dataset ownership via on-chain hashes.</li>
              <li>Monitor and prevent fraud, piracy, and abuse.</li>
              <li>Communicate with you (support, updates, transactional emails).</li>
            </ul>

            <h2>Data Sharing &amp; Disclosure</h2>
            <p>
              We do not sell personal information. We may share data with:
            </p>
            <ul>
              <li>Service providers (hosting, IPFS pinning, analytics) under strict confidentiality.</li>
              <li>When required by law or to respond to legal requests.</li>
            </ul>

            <h2>Security</h2>
            <p>
              We employ industry-standard technical and organizational measures — including AES-256
              encryption for dataset storage, in-memory pipelines for decryption/watermarking, and
              asymmetric key wrapping for key transport — to protect your data. Private keys are never
              transmitted to or stored by Key-N-Share.
            </p>

            <h2>IPFS and On-Chain Data</h2>
            <p>
              Encrypted dataset files are stored on IPFS using content-addressed CIDs. Metadata and
              integrity hashes (SHA-256) are stored on Solana. These systems are public and immutable;
              please avoid uploading personally-identifiable information to files that will be published.
            </p>

            <h2>Cookies and Tracking</h2>
            <p>
              We use cookies and similar technologies for functionality and analytics. You can control
              cookie preferences via your browser settings, but disabling certain cookies may affect
              site functionality.
            </p>

            <h2>Your Rights</h2>
            <p>
              Depending on your jurisdiction, you may have rights to access, correct, or delete your
              personal data. To exercise these rights, contact us at <a href="mailto:keynshare@gmail.com" className="text-indigo-600 dark:text-indigo-400">keynshare@gmail.com</a>.
            </p>

            <h2>Children</h2>
            <p>
              Key-N-Share is not intended for users under 16. We do not knowingly collect personal
              information from children under 16.
            </p>

            <h2>Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. If we make material changes, we
              will notify you by posting the updated policy and updating the "Last updated" date.
            </p>

            <h2>Contact</h2>
            <p>
              Questions? Reach out at <a href="mailto:keynshare@gmail.com" className="text-indigo-600 dark:text-indigo-400">keynshare@gmail.com</a>.
            </p>
          </section>
        </main>

        <footer className="max-w-6xl mx-auto p-6 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center justify-between">
            <span>© {new Date().getFullYear()} Key-N-Share</span>
            <div className="space-x-4">
              <a href="/privacy-policy"><a>Privacy</a></a>
              <a href="/terms-and-conditions"><a>Terms</a></a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Privacy;


