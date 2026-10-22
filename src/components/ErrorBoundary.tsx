import React, { Component, ErrorInfo, ReactNode } from 'react';
import { isChunkLoadError, reloadOnceForUpdate } from '../lib/lazyWithReload';

interface Props {
  children?: ReactNode;
  /** When this changes (e.g. the address), the boundary tries again. */
  resetKey?: string;
}

interface State {
  hasError: boolean;
}

const lang = () => (typeof document !== 'undefined' && document.documentElement.lang === 'en' ? 'en' : 'el');

/**
 * If a page fails, a calm message with a way back, never a blank screen.
 * A missing piece after a new version of the site reloads the page once.
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false };

  public static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, info: ErrorInfo) {
    if (isChunkLoadError(error) && reloadOnceForUpdate()) return;
    console.error('Page error:', error, info.componentStack);
  }

  public componentDidUpdate(prev: Props) {
    if (this.state.hasError && prev.resetKey !== this.props.resetKey) this.setState({ hasError: false });
  }

  public render() {
    if (!this.state.hasError) return this.props.children;
    const el = lang() === 'el';
    return (
      <div role="alert" className="min-h-[60dvh] flex flex-col items-center justify-center gap-4 px-6 text-center text-white/80">
        <p className="text-[17px] leading-relaxed max-w-xs">
          {el ? 'Κάτι δεν φόρτωσε σωστά. Δεν έκανες εσύ κάτι λάθος.' : 'Something did not load properly. You did nothing wrong.'}
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => window.location.reload()}
            className="min-h-[44px] px-5 rounded-full bg-white/[0.08] border border-white/15 text-[14px] text-white/90 hover:bg-white/[0.12]"
          >
            {el ? 'Ξαναφόρτωσε' : 'Reload'}
          </button>
          <a
            href={el ? '/el' : '/en'}
            className="min-h-[44px] px-5 flex items-center rounded-full border border-white/10 text-[14px] text-white/60 hover:text-white/85"
          >
            {el ? 'Αρχική' : 'Home'}
          </a>
        </div>
      </div>
    );
  }
}
