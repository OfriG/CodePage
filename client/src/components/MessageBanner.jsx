export default function MessageBanner({ message }) {
    return message ? <div className="message-banner">{message}</div> : null;
  }
  