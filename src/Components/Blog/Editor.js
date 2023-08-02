import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css';
import { storage } from '../../config/firebase-config';
import { ref } from 'firebase/storage';
import { async } from '@firebase/util';
import { useRef } from 'react';

export default function Editor({ value, onChange }) {
    const quillRef = useRef(null); // Ref to hold the Quill instance


    const modules = {
        toolbar: {
            container: [
                ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
                ['blockquote', 'code-block'],

                [{ 'header': 1 }, { 'header': 2 }],               // custom button values
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
                [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
                [{ 'direction': 'rtl' }],                         // text direction

                [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                [{ 'image': 'Upload Image' }],
                [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
                [{ 'font': [] }],
                [{ 'align': [] }],

                ['clean']                                         // remove formatting button
            ]
        },

    };

    const imageHandler = async function (image) {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();
        input.onchange = async () => {
            const file = input.files[0];
            const storageRef = ref(storage, `images/${file.name}`);
            const imageRef = storageRef.child(file.name);
            await imageRef.put(file);

            const imageURL = await imageRef.getDownloadURL();
            console.log("imageURL ", imageURL);

            // Insert the image into the editor at the current cursor position
            const quill = this.quillRef.getEditor();
            const range = quill.getSelection(true);
            quill.insertEmbed(range.index, 'image', imageURL);
        }


    }

    // Custom handler for the "image" toolbar button
    const formats = [
        'bold', 'italic', 'underline', 'strike',
        'blockquote', 'code-block', 'header', 'list',
        'script', 'indent', 'direction', 'size',
        'color', 'background', 'font', 'align', 'image' // Add 'image' to the formats array
    ];


    return (
        <div className="content">
            <ReactQuill
                value={value}
                theme={'snow'}
                onChange={onChange}
                modules={modules}
                formats={formats}
                ref={quillRef}
            />
        </div>
    );
}




//   [
//     [{ header: [1, 2, false] }],
//     ['bold', 'italic', 'underline', 'strike', 'blockquote'],
//     [
//         { list: 'ordered' },
//         { list: 'bullet' },
//         { indent: '-1' },
//         { indent: '+1' },

//     ],
//     ['link', 'image'],
//     ['clean'],
// ]


// const file = image;
//         const storageRef = ref(storage, `/files/${file.name}`);

//         try {
//             const uploadTaskSnapshot = await storageRef.child(`images/${file.name}`).put(file);
//             const downloadURL = await uploadTaskSnapshot.ref.getDownloadURL();

//             const quill = this.quill;
//             const range = quill.getSelection(true);
//             quill.insertEmbed(range.index, 'image', downloadURL);
//         } catch (error) {
//             console.log('Error uploading file: ', error);
//         }