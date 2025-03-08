import { useEffect } from 'react';

const GlobalEventListener = () => {
  useEffect(() => {
    const handleStorageEvent = (event) => {
      // When 'logoutEvent' is triggered, refresh the page
      if (event.key === 'logoutEvent' || event.key === 'loginEvent') {
        window.location.reload(); // Refresh the page
      }
    };

    // Listen for changes to localStorage
    window.addEventListener('storage', handleStorageEvent);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, []);

  return null; // No rendering needed for this component
};

export default GlobalEventListener;






// import { useEffect } from 'react';

// const GlobalEventListener = () => {
//   useEffect(() => {
//     const handleLogoutEvent = (event) => {
//       if (event.key === 'logoutEvent') {
//         // When 'logoutEvent' is triggered in any tab, refresh the page in this tab
//         window.location.reload();
//       }
//     };

//     // Listen for storage changes
//     window.addEventListener('storage', handleLogoutEvent);

//     // Cleanup the event listener when the component unmounts
//     return () => {
//       window.removeEventListener('storage', handleLogoutEvent);
//     };
//   }, []);

//   return null; // This component does not need to render anything
// };

// export default GlobalEventListener;
