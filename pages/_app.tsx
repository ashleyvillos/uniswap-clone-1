import '@/styles/globals.css'
import { TransactionProvider } from '@/context/TransactionContext'
import type { AppProps } from 'next/app'

// export default function App({ Component, pageProps }: AppProps) {
export default function App({ Component, pageProps }: AppProps) {
  // return <Component {...pageProps} />
  return (
    <TransactionProvider>
      <Component {...pageProps} />
    </TransactionProvider>
  )
}
