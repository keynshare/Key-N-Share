"use client";

import React from 'react';
import Link from "next/link";

const Terms = () => {
  return (
    <>
      <div className="min-h-screen dark:text-gray-100 transition-colors duration-200">
        <header className="max-w-6xl mx-auto p-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-gradient-to-br from-indigo-600 to-pink-500 flex items-center justify-center text-white font-bold">K</div>
            <span className="font-semibold text-lg">Key-N-Share</span>
          </Link>
          <nav>
            <Link href="/privacy-policy" className="text-sm hover:underline">Privacy Policy</Link>
          </nav>
        </header>

        <main className="max-w-4xl mx-auto p-6 rounded-2xl shadow-lg">
          <h1 className="text-3xl font-extrabold mb-4">Terms &amp; Conditions</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">Last updated: October 3, 2025</p>

          <section className="prose prose-md dark:prose-invert max-w-none">
            <h2>Acceptance of Terms</h2>
            <p>
              By accessing or using Key-N-Share (the &quot;Service&quot;), you agree to be bound by these
              Terms &amp; Conditions. If you do not agree, you must not use the Service.
            </p>

            <h2>Accounts and Wallets</h2>
            <p>
              You are responsible for maintaining the security of your account credentials and
              cryptocurrency wallet. Key-N-Share will never ask for your private keys. Any loss
              resulting from compromise of your private wallet keys is your responsibility.
            </p>

            <h2>Listing &amp; Purchase Rules</h2>
            <ul>
              <li>Sellers must own the rights to any dataset they list.</li>
              <li>Each listing must include accurate metadata and an IPFS CID for the encrypted content.</li>
              <li>Purchases are executed on the Solana blockchain. We rely on on-chain proofs (SHA-256) to verify file integrity.</li>
            </ul>

            <h2>Watermarking and Anti-Piracy</h2>
            <p>
              Purchased datasets are watermarked with a buyer-specific fingerprint to deter
              unauthorized redistribution. By purchasing, you agree not to remove or attempt to
              circumvent watermarking or other anti-piracy measures.
            </p>

            <h2>Intellectual Property</h2>
            <p>
              All intellectual property rights in the platform and the listings remain with their
              respective owners. Listing a dataset does not transfer ownership of the underlying
              intellectual property unless explicitly stated.
            </p>

            <h2>Prohibited Content</h2>
            <p>
              You may not list, sell, or distribute content that is illegal, infringes third-party
              rights, or violates platform policies. Key-N-Share reserves the right to remove
              prohibited content and suspend offending accounts.
            </p>

            <h2>Fees &amp; Payments</h2>
            <p>
              Transactions occur directly between buyer and seller on Solana; Key-N-Share does not
              custody user funds. Platform fees (if any) will be disclosed on the listing page and
              are collectible off-chain or via a smart contract as described on the site.
            </p>

            <h2>Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, Key-N-Share and its affiliates shall not be
              liable for indirect damages, loss of data, or loss of profits arising from use of
              the Service. The Service is provided “as is”.
            </p>

            <h2>Governing Law</h2>
            <p>
              These Terms are governed by the laws of the jurisdiction where the platform is
              operated. Any disputes should be directed to the contact email first for
              resolution.
            </p>

            <h2>Modifications</h2>
            <p>
              We may modify these Terms from time to time. Continued use of the Service after
              changes constitutes acceptance of the updated Terms.
            </p>

            <h2>Contact</h2>
            <p>
              For questions regarding these Terms, contact <a href="mailto:keynshare@gmail.com" className="text-indigo-600 dark:text-indigo-400">keynshare@gmail.com</a>.
            </p>
          </section>
        </main>

        <footer className="max-w-6xl mx-auto p-6 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center justify-between">
            <span>© {new Date().getFullYear()} Key-N-Share</span>
            <div className="space-x-4">
              <Link href="/privacy-policy">Privacy</Link>
              <Link href="/terms-and-conditions">Terms</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Terms;
