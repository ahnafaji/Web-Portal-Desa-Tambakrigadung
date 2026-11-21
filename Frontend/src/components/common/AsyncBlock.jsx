// Pembungkus status loading / error / data supaya tiap section tidak mengulang kode yang sama.
export default function AsyncBlock({ state, children, minHeight = 160 }) {
  if (state.loading) return <div className="skeleton" style={{ minHeight }} aria-busy="true" />;
  if (state.error) return <p className="state-msg" role="alert">{state.error.message}</p>;
  if (!state.data || (Array.isArray(state.data) && state.data.length === 0))
    return <p className="state-msg">Data Kosong Der.</p>;
  return children(state.data);
}
