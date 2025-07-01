// import React, { useState } from "react";
// import { documents } from "./dummyData"; 

// export default function PdfViewer() {
//   const [selectedDoc, setSelectedDoc] = useState(null);

//   return (
//     <div className="p-6 max-w-5xl mx-auto">
//       <h1 className="text-2xl font-bold mb-6">Document Thumbnails</h1>
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//         {documents.map((doc, index) => (
//           <div
//             key={index}
//             onClick={() => setSelectedDoc(doc)}
//             className="cursor-pointer border rounded shadow hover:shadow-lg transition p-2"
//           >
//             <iframe
//               src={`${doc.image}#toolbar=0&navpanes=0&scrollbar=0&page=1`}
//               title={doc.name}
//               className="w-full h-64 pointer-events-none"
//             />
//             <p className="text-center mt-2 font-medium">{doc.name}</p>
//           </div>
//         ))}
//       </div>

//       {/* Modal */}
//       {selectedDoc && (
//         <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center p-4">
//           <div className="bg-white rounded-lg w-full max-w-4xl h-[90vh] relative">
//             <button
//               className="absolute top-2 right-2 text-white bg-red-500 rounded px-3 py-1 text-sm"
//               onClick={() => setSelectedDoc(null)}
//             >
//               Close
//             </button>
//             <iframe
//               src={`${selectedDoc.image}#toolbar=0&navpanes=0&scrollbar=0`}
//               title="PDF Modal"
//               className="w-full h-full rounded-b-lg"
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
