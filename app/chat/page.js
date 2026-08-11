import ChatClient from './ChatClient';

export const metadata = {
  title: 'Ask IronWake — IronWake',
  description: 'Full conversation view of the IronWake site assistant. Model-backed, scoped to IronWake business questions, never used as a general coding tool.'
};

export default function ChatPage() {
  return <ChatClient />;
}