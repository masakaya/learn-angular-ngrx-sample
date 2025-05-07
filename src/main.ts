import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

// MSWのService Workerを削除する関数
async function unregisterServiceWorkers() {
  try {
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        console.log('Unregistering service worker:', registration);
        await registration.unregister();
      }
      console.log('All service workers unregistered');
    }
  } catch (error) {
    console.error('Error unregistering service workers:', error);
  }
}

// Initialize MSW in development mode
async function prepareApp() {
  try {
    // まず既存のService Workerを全て削除
    await unregisterServiceWorkers();

    if (environment.useMsw) {
      try {
        console.log('Initializing MSW...');
        const { worker } = await import('./mocks/browser');
        await worker.start({
          onUnhandledRequest: 'bypass', // Ignore unhandled requests
          serviceWorker: {
            url: './mockServiceWorker.js',
            options: {
              // キャッシュを使わないようにする
              updateViaCache: 'none'
            }
          }
        });
        console.log('MSW initialized successfully');
      } catch (error) {
        console.error('Failed to initialize MSW:', error);
        // Continue with bootstrapping even if MSW fails
      }
    }

    console.log('Bootstrapping application...');
    return await bootstrapApplication(AppComponent, appConfig)
      .then(() => console.log('Application bootstrapped successfully'))
      .catch((err) => {
        console.error('Failed to bootstrap application:', err);
        throw err;
      });
  } catch (error) {
    console.error('Error in prepareApp:', error);
    // Display error on page for debugging
    document.body.innerHTML = `
      <div style="color: red; font-family: sans-serif; padding: 20px;">
        <h1>Application Failed to Start</h1>
        <p>Error: ${error instanceof Error ? error.message : String(error)}</p>
        <p>Check the console for more details.</p>
      </div>
    `;
  }
}

prepareApp()
  .catch((err) => console.error('Unhandled error in application startup:', err));
