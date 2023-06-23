import React from "react";
import Navbar from "../Navbar/Navbar";
import { DefaultSeo } from "next-seo";
import Head from "next/head";

type LayoutProps = {
	children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children}) => {
	return (
		<>
			<Head>
				<link
					rel="shortcut icon"
					href="/images/logo.png"
				/>
			</Head>
			<DefaultSeo
				title="The Strides - One platform, many communities, one goal."
				description="Discover communities right for you, engage and grow."
				openGraph={{
					type: 'website',
					locale: 'en_IE',
					url: 'https://www.thestrides.com.ng/',
					siteName: 'The Strides',
				}}
				twitter={{
					handle: '@stridesconnect',
					site: '@stridesconnect',
					cardType: 'summary_large_image',
				}}
			/>
			<Navbar />
			{children}
		</>
	);
}

export default Layout;