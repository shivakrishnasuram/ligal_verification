import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Box,
    Typography,
    Paper,
    Grid,
    CircularProgress,
    Modal,
    Button,
} from "@mui/material";
import toast from "react-hot-toast";
import "./AssertDetails.css";

// PDF Viewer
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";

export default function VerifiedAssets() {
    const [verifiedAssets, setVerifiedAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDoc, setSelectedDoc] = useState(null);

    useEffect(() => {
        const fetchVerifiedAssets = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/verified-assets");
                setVerifiedAssets(response.data.verifiedAssets);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching verified assets:", error);
                toast.error("Failed to load verified assets");
                setLoading(false);
            }
        };

        fetchVerifiedAssets();
    }, []);

    if (loading) {
        return (
            <Box p={4} textAlign="center">
                <CircularProgress />
                <Typography mt={2}>Loading verified assets...</Typography>
            </Box>
        );
    }

    if (verifiedAssets.length === 0) {
        return (
            <Box p={4} textAlign="center">
                <Typography>No verified assets found.</Typography>
            </Box>
        );
    }

    return (
        <Box p={4}>
            <Typography variant="h5" mb={3}>
                Verified Assets
            </Typography>

            <Grid container spacing={3}>
                {verifiedAssets.map((asset, index) => (
                    <Grid item xs={12} md={6} key={index}>
                        <Paper sx={{ p: 3 }}>
                            <Typography><strong>User ID:</strong> {asset.user_id}</Typography>
                            <Typography><strong>Asset ID:</strong> {asset.asset_id}</Typography>
                            <Typography><strong>Message:</strong> {asset.message}</Typography>
                            <Typography><strong>Status:</strong> {asset.status}</Typography>
                            <Typography><strong>Property Verified:</strong> {asset.propertyVerified ? "Yes" : "No"}</Typography>
                            <Typography><strong>Documents Verified:</strong> {asset.documentsVerified ? "Yes" : "No"}</Typography>

                            {asset.uploadedFile && (
                                <Box
                                    mt={2}
                                    sx={{
                                        border: "1px solid #ccc",
                                        height: "250px",
                                        overflow: "hidden",
                                        cursor: "pointer",
                                    }}
                                    onClick={() => setSelectedDoc(asset)}
                                >
                                    <div
                                        className="thumbnail-container"
                                        style={{
                                            height: "100%",
                                            width: "100%",
                                            overflow: "hidden",
                                            borderRadius: "4px",
                                            backgroundColor: "#f5f5f5",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            pointerEvents: "none", // disable scroll/interactions
                                        }}
                                    >
                                        <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
                                            <Viewer
                                                fileUrl={`http://localhost:5000/${asset.uploadedFile}`}
                                                defaultScale={0.5}
                                                renderLoader={() => <div style={{ padding: "10px" }}>Loading PDF...</div>}
                                            />
                                        </Worker>
                                    </div>
                                </Box>
                            )}
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            {/* Full PDF Modal */}
            {selectedDoc && (
                <Modal open={true} onClose={() => setSelectedDoc(null)}>
                    <Box
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: "80%",
                            height: "90vh",
                            bgcolor: "background.paper",
                            boxShadow: 24,
                            p: 2,
                            overflow: "hidden",
                            borderRadius: 2,
                        }}
                    >
                        <Button
                            onClick={() => setSelectedDoc(null)}
                            variant="contained"
                            color="error"
                            sx={{
                                position: "absolute",
                                top: 15,
                                right: 15,
                                zIndex: 1000,
                                minWidth: "80px",
                                fontWeight: "bold",
                                boxShadow: 3,
                            }}
                        >
                            ✕ Close
                        </Button>
                        <Box sx={{ width: "100%", height: "100%", overflow: "auto", pt: 1 }}>
                            <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
                                <Viewer fileUrl={`http://localhost:5000/${selectedDoc.uploadedFile}`} />
                            </Worker>
                        </Box>
                    </Box>
                </Modal>
            )}
        </Box>
    );
}
