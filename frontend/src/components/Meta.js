import React from 'react';
import { Helmet } from 'react-helmet-async';

const Meta = ({ title, description, keywords, canonical, ogImage, ogType, twitterCard }) => {
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  
  return (
    <Helmet>
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta name='keywords' content={keywords} />
      {canonical && <link rel='canonical' href={canonical} />}
      
      {/* OpenGraph Tags for Social Sharing */}
      <meta property='og:title' content={title} />
      <meta property='og:description' content={description} />
      <meta property='og:type' content={ogType || 'website'} />
      <meta property='og:url' content={canonical || currentUrl} />
      {ogImage && <meta property='og:image' content={ogImage} />}
      
      {/* Twitter Card Tags */}
      <meta name='twitter:card' content={twitterCard || 'summary_large_image'} />
      <meta name='twitter:title' content={title} />
      <meta name='twitter:description' content={description} />
      {ogImage && <meta name='twitter:image' content={ogImage} />}
    </Helmet>
  );
};

Meta.defaultProps = {
  title: 'Šuzeraj | Luxury Shoe Marketplace',
  description: 'Buy and sell rare sneakers, vintage kicks, and luxury footwear in Croatia.',
  keywords: 'shoes, sneakers, marketplace, buy shoes, sell shoes, croatia, suzeraj',
  ogType: 'website',
  twitterCard: 'summary_large_image'
};

export default Meta;