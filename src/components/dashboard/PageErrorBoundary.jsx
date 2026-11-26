import { Component } from 'react';
import { EmptyState } from './DashWidgets';

/**
 * Catches a crash in one dashboard page and shows a message with a way out, instead of
 * leaving the whole screen blank. `resetKey` (the URL) clears the error on navigation.
 */
export default class PageErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null, key: props.resetKey };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  static getDerivedStateFromProps(props, state) {
    // Moving to another page gives it a fresh start.
    return props.resetKey !== state.key ? { error: null, key: props.resetKey } : null;
  }

  componentDidCatch(error, info) {
    console.error('Page crashed:', error, info?.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <section className="kd-stage kd-page">
        <EmptyState
          icon="⚠️"
          title="Something went wrong on this page"
          action={
            <button type="button" className="kd-btn kd-btn-dark" onClick={() => window.location.reload()}>
              Reload
            </button>
          }
        >
          The rest of the app still works; use the menu to go elsewhere. Details for the developers:{' '}
          <code>{String(this.state.error?.message ?? this.state.error)}</code>
        </EmptyState>
      </section>
    );
  }
}
