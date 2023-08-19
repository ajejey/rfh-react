import React, { useCallback, useEffect } from 'react';
import { useQuill } from 'react-quilljs';
import 'react-quill/dist/quill.snow.css';
import Quill from 'quill';
import BlotFormatter from 'quill-blot-formatter';
import { storage } from '../../config/firebase-config';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { convertToWebP } from '../../Constants/commonFunctions';

Quill.register('modules/blotFormatter', BlotFormatter);

export default function Editor({ value, onChange }) {
    const { quill, quillRef } = useQuill({
        modules: {
            toolbar: {
                container: [
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ align: [] }],

                    [{ list: 'ordered' }, { list: 'bullet' }],
                    [{ indent: '-1' }, { indent: '+1' }],

                    [{ size: ['small', false, 'large', 'huge'] }],
                    [{ header: [1, 2, 3, 4, 5, 6, false] }],
                    ['link', 'image', 'video'],
                    [{ color: [] }, { background: [] }],

                    ['clean'],                                       // remove formatting button
                ],
                handlers: {
                    image: async () => {
                        const input = document.createElement('input');
                        input.setAttribute('type', 'file');
                        input.setAttribute('accept', 'image/*');
                        input.click();

                        input.onchange = async () => {
                            const file = input.files[0];
                            // Check if the file is an image
                            if (!file.type.startsWith('image/') || file.size > 1024 * 1024) {
                                console.error('Invalid file type or size too large');
                                alert('Invalid file type or size too large. Please upload image of less than 1MB.');
                                return;
                            }
                            const storageRef = ref(getStorage(), `blog-images/${file.name}`);
                            const convertedFile = await convertToWebP(file);
                            // Upload converted image to Firebase Storage
                            const snapshot = await uploadBytes(storageRef, convertedFile);

                            // Get download URL of uploaded image
                            const imageUrl = await getDownloadURL(snapshot.ref);

                            // Insert image into Quill editor
                            const range = quill.getSelection();
                            quill.insertEmbed(range.index, 'image', imageUrl, Quill.sources.USER);
                        };

                        function handleImageResize() {
                            const range = quill.getSelection();
                            if (range) {
                                const [image] = quill.getSemanticAtCursor();
                                if (image && image.tagName === 'IMG') {
                                    const width = prompt('Enter width in pixels');
                                    if (width) {
                                        image.style.width = `${width}px`;
                                    }
                                }
                            }
                        }

                        if (quill) {
                            quill.getModule('toolbar').addHandler('image', handleImageResize);
                        }
                    },
                },
            },
            blotFormatter: {},
        },
        formats: [
            'bold', 'italic', 'underline', 'strike',
            'align', 'list', 'indent',
            'size', 'header',
            'link', 'image', 'video',
            'color', 'background',
            'clean',
        ],
    });

    const handleImageUpload = useCallback(async () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            const file = input.files[0];
            // Check if the file is an image
            if (!file.type.startsWith('image/') || file.size > 1024 * 1024) {
                console.error('Invalid file type or size too large');
                alert('Invalid file type or size too large. Please upload image of less than 1MB.');
                return;
            }
            const storageRef = ref(getStorage(), `blog-images/${file.name}`);
            const convertedFile = await convertToWebP(file);
            // Upload converted image to Firebase Storage
            const snapshot = await uploadBytes(storageRef, convertedFile);

            // Get download URL of uploaded image
            const imageUrl = await getDownloadURL(snapshot.ref);

            // Insert image into Quill editor
            const range = quill.getSelection();
            quill.insertEmbed(range.index, 'image', imageUrl, Quill.sources.USER);
        };

        function handleImageResize() {
            const range = quill.getSelection();
            if (range) {
                const [image] = quill.getSemanticAtCursor();
                if (image && image.tagName === 'IMG') {
                    const width = prompt('Enter width in pixels');
                    if (width) {
                        image.style.width = `${width}px`;
                    }
                }
            }
        }

        if (quill) {
            quill.getModule('toolbar').addHandler('image', handleImageResize);
        }
    }, [quill]);

    if (quill) {
        quill.getModule('toolbar').addHandler('image', handleImageUpload);
    }

    useEffect(() => {
        if (quill) {
            quill.on("text-change", (delta, oldContents) => {
                // console.log("Text change!");
                // console.log(delta);
                console.log("quill.root.innerHTML  ", quill.root.innerHTML); // Get innerHTML using quill
                console.log(
                    "quillRef.current.firstChild.innerHTML ",
                    quillRef.current
                ); // Get innerHTML using quillRef

                onChange(quill.root.innerHTML);
            });
        }
    }, [quill, Quill, onChange]);

    return (
        <div className="content">
            <div ref={quillRef} />
        </div>
    );
}