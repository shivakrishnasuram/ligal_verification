import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { documents } from "./data/dummyData";
import "./AssertDetails.css";
import axios from "axios";

import {
    Box,
    Button,
    TextField,
    Checkbox,
    FormControlLabel,
    Typography,
    Grid,
    Paper,
    Modal,
} from "@mui/material";
import toast, { Toaster } from "react-hot-toast";

// PDF Viewer
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";

export default function AssetDetails() {
    const { state: asset } = useLocation();
    const navigate = useNavigate();
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [verifyFile, setVerifyFile] = useState(null);

    const [showAddForm, setShowAddForm] = useState(false);
    const [showQueryForm, setShowQueryForm] = useState(false);
    const [addMessage, setAddMessage] = useState("");
    const [queryMessage, setQueryMessage] = useState("");
    const [showVerifyModal, setShowVerifyModal] = useState(false);
    const [verifyMessage, setVerifyMessage] = useState("");
    const [propertyVerified, setPropertyVerified] = useState(false);
    const [documentsVerified, setDocumentsVerified] = useState(false);

    useEffect(() => {
        if (asset) {
            toast.success(`Welcome ${asset.name}!`);
        }
    }, [asset]);

    const handleVerifySubmit = async () => {
        try {
            const formData = new FormData();
            formData.append("user_id", asset.user_id);
            formData.append("asset_id", asset._id);
            formData.append("message", verifyMessage);
            formData.append("propertyVerified", propertyVerified);
            formData.append("documentsVerified", documentsVerified);
            formData.append("status", "Legal verification done");
            if (verifyFile) {
                formData.append("file", verifyFile); // 👈 Add file
            }

            await axios.post("http://localhost:5000/api/verify", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            toast.success("Verification submitted");
            setShowVerifyModal(false);
            setVerifyMessage("");
            setPropertyVerified(false);
            setDocumentsVerified(false);
            setVerifyFile(null);
            navigate("/")
        } catch (error) {
            console.error("Verification failed:", error);
            toast.error("Verification failed");
        }
    };


    const handleSubmit = async (type) => {
        const payload = {
            user_id: asset.user_id,
            asset_id: asset._id,
            message: type === "add" ? addMessage : queryMessage,
        };

        try {
            const endpoint =
                type === "add"
                    ? "http://localhost:5000/api/add"
                    : "http://localhost:5000/api/add-query";

            await axios.post(endpoint, payload);
            toast.success(`${type === "add" ? "Add" : "Query"} submitted successfully`);

            if (type === "add") {
                setAddMessage("");
                setShowAddForm(false);
            } else {
                setQueryMessage("");
                setShowQueryForm(false);
            }
        } catch (err) {
            console.error(err);
            toast.error("Submission failed.");
        }
    };

    // const handleVerifySubmit = async () => {
    //     try {
    //         const payload = {
    //             user_id: asset.user_id,
    //             asset_id: asset._id,
    //             message: verifyMessage,
    //             propertyVerified,
    //             documentsVerified,
    //             status: "Legal verification done",
    //         };

    //         await axios.post("http://localhost:5000/api/verify", payload);

    //         toast.success("Verification submitted");
    //         setShowVerifyModal(false);
    //         setVerifyMessage("");
    //         setPropertyVerified(false);
    //         setDocumentsVerified(false);
    //     } catch (error) {
    //         console.error("Verification failed:", error);
    //         toast.error("Verification failed");
    //     }
    // };

    if (!asset) {
        return (
            <Box p={4} textAlign="center">
                <Typography color="error">No asset data found.</Typography>
                <Button
                    onClick={() => navigate("/")}
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2 }}
                >
                    Go Back
                </Button>
            </Box>
        );
    }

    return (
        <Box maxWidth="1200px" mx="auto" p={4}>
            <Toaster position="top-right" />

            {/* Asset Info */}
            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}><strong>Name:</strong> {asset.name}</Grid>
                    <Grid item xs={12} sm={4}><strong>Category:</strong> {asset.category}</Grid>
                    <Grid item xs={12} sm={4}><strong>Type:</strong> {asset.kind}</Grid>
                    <Grid item xs={12} sm={4}><strong>Value:</strong> ₹{asset.property_value}</Grid>
                    <Grid item xs={12} sm={4}><strong>Address:</strong> {asset.full_address}</Grid>
                    <Grid item xs={12} sm={4}><strong>User ID:</strong> {asset.user_id}</Grid>
                </Grid>
            </Paper>

            {/* Add / Query Buttons */}
            <Box display="flex" justifyContent="space-between" mb={3}>
                <Typography variant="h6">Documents</Typography>
                <Box>
                    <Button variant="contained" color="success" sx={{ mr: 2 }} onClick={() => setShowAddForm(!showAddForm)}>
                        Add
                    </Button>
                    <Button variant="contained" color="warning" onClick={() => setShowQueryForm(!showQueryForm)}>
                        Add Queries
                    </Button>
                </Box>
            </Box>

            {/* Add Form */}
            {showAddForm && (
                <Box mb={3}>
                    <TextField
                        label="Enter message for Add"
                        fullWidth
                        value={addMessage}
                        onChange={(e) => setAddMessage(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <Button variant="contained" onClick={() => handleSubmit("add")}>
                        Submit Add
                    </Button>
                </Box>
            )}

            {/* Query Form */}
            {showQueryForm && (
                <Box mb={3}>
                    <TextField
                        label="Enter message for Query"
                        fullWidth
                        value={queryMessage}
                        onChange={(e) => setQueryMessage(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <Button variant="contained" onClick={() => handleSubmit("query")}>
                        Submit Query
                    </Button>
                </Box>
            )}

            {/* Document Thumbnails */}
            <Grid container spacing={3}>
                {documents.map((doc, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Paper sx={{ p: 2, cursor: "pointer" }} onClick={() => setSelectedDoc(doc)} elevation={2}>
                            <div className="thumbnail-container" style={{
                                height: '200px',
                                width: '300px',
                                overflow: 'hidden',
                                border: '1px solid #e0e0e0',
                                borderRadius: '4px',
                                backgroundColor: '#f5f5f5',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                pointerEvents: 'none'
                            }}>
                                <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
                                    <div style={{
                                        width: '100%',
                                        height: '100%',
                                        transform: 'scale(0.8)',
                                        transformOrigin: 'center'
                                    }}>
                                        <Viewer
                                            fileUrl={doc.image}
                                            defaultScale={0.5}
                                            initialPage={0}
                                            enableSmoothScroll={false}
                                            renderLoader={() => <div>Loading PDF...</div>}
                                        />
                                    </div>
                                </Worker>
                            </div>
                            <Typography textAlign="center" mt={1}>{doc.name}</Typography>
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
                        {/* Close Button with better visibility */}
                        <Button
                            onClick={() => setSelectedDoc(null)}
                            variant="contained"
                            color="error"
                            sx={{
                                position: "absolute",
                                top: 15,
                                right: 15,
                                zIndex: 1000,
                                minWidth: '80px',
                                fontWeight: 'bold',
                                boxShadow: 3
                            }}
                        >
                            ✕ Close
                        </Button>
                        <Box sx={{ width: "100%", height: "100%", overflow: "auto", pt: 1 }}>
                            <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
                                <Viewer fileUrl={selectedDoc.image} />
                            </Worker>
                        </Box>
                    </Box>
                </Modal>
            )}

            {/* Verify Buttons */}
            <Box mt={4}>
                <Button
                    variant="contained"
                    color="success"
                    sx={{ mr: 2 }}
                    onClick={() => setShowVerifyModal(true)}
                >
                    Verify
                </Button>
                <Button variant="contained" color="primary" onClick={() => navigate("/")}>
                    Back to Table
                </Button>
            </Box>

            {/* Verify Modal */}
            <Modal open={showVerifyModal} onClose={() => setShowVerifyModal(false)}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 500,
                        bgcolor: "background.paper",
                        borderRadius: 2,
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <Typography variant="h6" mb={2}>Legal Verification</Typography>

                    <FormControlLabel
                        control={<Checkbox checked={propertyVerified} onChange={() => setPropertyVerified(!propertyVerified)} />}
                        label="Property Details Verified"
                    />
                    <FormControlLabel
                        control={<Checkbox checked={documentsVerified} onChange={() => setDocumentsVerified(!documentsVerified)} />}
                        label="Required Documents Verified"
                    />
                    <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => {
                            const file = e.target.files[0];
                            if (file && file.type !== "application/pdf") {
                                toast.error("Only PDF files are allowed!");
                                e.target.value = null; // Reset file input
                                setVerifyFile(null);
                            } else {
                                setVerifyFile(file);
                            }
                        }}
                        style={{ marginTop: "1rem" }}
                    />

                    <TextField
                        label="Message"
                        multiline
                        rows={4}
                        fullWidth
                        value={verifyMessage}
                        onChange={(e) => setVerifyMessage(e.target.value)}
                        sx={{ mt: 2 }}
                    />

                    <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
                        <Button onClick={() => setShowVerifyModal(false)} color="inherit">
                            Cancel
                        </Button>
                        <Button variant="contained" onClick={handleVerifySubmit}>
                            Verify Now
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
}