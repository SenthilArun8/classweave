const SubHeading = () => {
  return (
    <section className="relative isolate w-full flex items-center justify-center px-4 py-10 sm:py-14 bg-gradient-to-br from-emerald-50 via-amber-50 to-white border-b border-emerald-100 shadow-md">
      <div className="max-w-3xl w-full text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-emerald-900 mb-4 drop-shadow-md">
          Your Data, Protected Like a Fortress.
        </h2>
        <div className="space-y-3 text-emerald-900 text-base sm:text-lg font-medium">
          <p>
            <span className="font-bold text-emerald-800">
              Encryption at Every Step:
            </span>{' '}
            From the moment your data touches our systems, it's immediately
            encrypted using AES-256, a gold-standard method. This ensures your
            private information stays private, even when it's just sitting in our
            database.
          </p>
          <p>
            <span className="font-bold text-emerald-800">
              Your Secure Connection:
            </span>{' '}
            Think of every visit to our site as traveling through a secure,
            invisible tunnel. We use TLS/SSL encryption for all communications,
            meaning your details are scrambled and protected from prying eyes as
            they travel between your browser and our servers.
          </p>
          <p>
            <span className="font-bold text-emerald-800">
              Smarter, Stronger Sessions:
            </span>{' '}
            Forget old, vulnerable tokens. We use PASETO tokens for your login
            sessions. These are a modern, cryptographically secure way to confirm
            your identity, making it incredibly tough for anyone else to
            impersonate you.
          </p>
          <p>
            <span className="font-bold text-emerald-800">
              Ironclad Server Protection:
            </span>{' '}
            Our systems are behind digital bouncers! Strict firewall rules ensure
            that only legitimate, authorized traffic can ever reach your valuable
            information.
          </p>
          <p>
            <span className="font-bold text-emerald-800">
              Encrypted Peace of Mind:
            </span>{' '}
            We regularly back up all your data, and just like everything else,
            these backups are encrypted. So even in the unlikely event of a system
            issue, your information remains secure and recoverable.
          </p>
        </div>
      </div>
    </section>
  );
};

export default SubHeading;
