// ponytail: pure-function form handler extracted so behavioural tests can drive it
// without a DOM. The React component delegates here; the test exercises the same
// code path that runs in the browser.

export async function submitAudit({ payload, fetchImpl, form }) {
  const ui = { status: 'idle', message: '' };
  const setStatus = (s) => {
    ui.status = s;
  };
  const setMessage = (m) => {
    ui.message = m;
  };
  let response;
  let networkFailure = false;
  try {
    response = await fetchImpl('/api/audit', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch {
    networkFailure = true;
  }
  if (networkFailure || !response) {
    setStatus('error');
    setMessage('We could not reach the server. Check your connection and try again.');
    return ui;
  }
  let result = null;
  try {
    result = await response.json();
  } catch {
    result = null;
  }
  if (response.ok) {
    setStatus('success');
    setMessage(
      result?.message ||
        'We received your request. We will review it and follow up if needed.'
    );
    if (form) {
      try {
        form.reset();
      } catch {
        // ponytail: a reset failure must never overwrite a confirmed success
      }
    }
    return ui;
  }
  setStatus('error');
  setMessage(
    result?.message ||
      result?.error ||
      'We could not submit your request. Check the fields and try again.'
  );
  return ui;
}
