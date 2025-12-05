import { createBrowserRouter, Outlet } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
// import authRoutes from './routes-config/authRoutes'
// import ScrollProgress from '@/components/ui/scroll-progress';
import ScrollToTop from '@/components/ui/ScrollToTop';
import DynamicPageLoader from '@/components/ui/LazyCompoment';

/**
 * Creates a router with specified routes and elements for each route.
 * @param {Array} routes - An array of route objects containing path and element information.
 * @returns None
 */

const Router = createBrowserRouter([
	{
		path: '',
		element: (
			<>
				<Outlet />

				{/* To scroll to top each time that we change routes */}
				<ScrollToTop />
			</>
		),

		// Page erreur
		errorElement: <DynamicPageLoader pageKey="error/PageError" />,

		children: [
			{
				path: '/',
				element: (
					<MainLayout>
						<Outlet />
					</MainLayout>
				),
				children: [
					{
						path: '/',
						element: <DynamicPageLoader pageKey="home/Home" />
					},

					// Page des livraisons
					{
						path: '/deliveries',
						element: <DynamicPageLoader pageKey="deliveries/DeliveriesPage" />
					},
					// Page de suivi des livraisons
					{
						path: '/tracking/:deliveryId',
						element: <DynamicPageLoader pageKey="deliveries/DeliveryTrackingPage" />
					},
					// Alias pour la compatibilité avec les anciens liens
					{
						path: '/deliveries/:deliveryId/track',
						element: <DynamicPageLoader pageKey="deliveries/DeliveryTrackingPage" />
					},

					// Authentication routes part
					// authRoutes,
				]
			},
		],
	},
])

export default Router
