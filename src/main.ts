import './modern-normalize.css';
import './styles.css';

import App from './App.vue';
import { createApp } from 'vue';
import { router } from './router';
import { supabase } from './supabase';
import { userSession } from './supabase';

if ('serviceWorker' in navigator) {
	navigator.serviceWorker
		.register('service-worker.js')
		.then(() => console.log('Registration Successful'));
}

createApp(App).use(router).mount('#app');

supabase.auth.onAuthStateChange((_event, session) => {
	userSession.value = session;
});
