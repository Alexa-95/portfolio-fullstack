// Plain inline snippet instead of @next/third-parties: that package ships CJS client
// components, which the vinext/Vite RSC build resolves to undefined (React error #130).
export function GoogleTagManager({gtmId}:{gtmId:string}) {
  const id = JSON.stringify(gtmId);
  return <script id="gtm" dangerouslySetInnerHTML={{__html:`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s);j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+encodeURIComponent(i);f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer',${id});`}} />;
}

export function GoogleTagManagerNoScript({gtmId}:{gtmId:string}) {
  return <noscript><iframe src={`https://www.googletagmanager.com/ns.html?id=${encodeURIComponent(gtmId)}`} height="0" width="0" style={{display:'none',visibility:'hidden'}} /></noscript>;
}
