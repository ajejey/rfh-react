// import React from 'react';
// import { Grid, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, FormHelperText, TextField, Select, MenuItem, InputLabel, Checkbox, FormGroup, Button } from '@mui/material';
// import Header from '../Header';
// import formData from './formData.json'



// const FormBuilder = ({ formDataProps = formData }) => {
//     const [form, setForm] = React.useState(formDataProps);
//     const [values, setValues] = React.useState({});

//     const handleChange = (event) => {
//         setValues({
//             ...values,
//             [event.target.name]: event.target.type === 'checkbox' ? event.target.checked : event.target.value,
//         });
//     };

//     const handleSubmit = (event) => {
//         event.preventDefault();
//         console.log(values);
//     };

//     return (
//         <div>
//             <Header />
//             <div className="container-md mb-5 mt-5">
//                 <h2 className='h2'> {form?.title} </h2>
//                 <form onSubmit={handleSubmit}>
//                     <Grid container spacing={2}>
//                         {form?.inputs?.map((input, index) => {
//                             const isLastInputInRow = index % 2 === 1 && index !== form.inputs.length - 1;

//                             if (input.type === 'text' || input.type === 'email' || input.type === 'tel' || input.type === 'url' || input.type === 'website') {
//                                 return (
//                                     <Grid item xs={12} md={6} key={input.name}>                                       
//                                         <TextField
//                                             label={input.label}
//                                             name={input.name}
//                                             type={input.type}
//                                             required={input.required}
//                                             fullWidth
//                                             value={values[input.name] || ''}
//                                             onChange={handleChange}
//                                             helperText={input.helperText}
//                                         /> 
//                                     </Grid>
//                                 );
//                             } else if (input.type === 'date') {
//                                 return (
//                                     <Grid item xs={12} md={6} key={input.name}>
//                                         <TextField
//                                             label={input.label}
//                                             name={input.name}
//                                             type="date"
//                                             required={input.required}
//                                             fullWidth
//                                             value={values[input.name] || ''}
//                                             onChange={handleChange}
//                                             InputLabelProps={{
//                                                 shrink: true,
//                                             }}
//                                         />
//                                     </Grid>
//                                 );
//                             } else if (input.type === 'textarea') {
//                                 return (
//                                     <Grid item xs={12} md={6} key={input.name}>
//                                         <TextField
//                                             label={input.label}
//                                             name={input.name}
//                                             multiline
//                                             rows={input.rows || 4}
//                                             required={input.required}
//                                             fullWidth
//                                             value={values[input.name] || ''}
//                                             onChange={handleChange}
//                                             helperText={input.helperText}
//                                         />
//                                     </Grid>
//                                 );
//                             } else if (input.type === 'radio') {
//                                 return (
//                                     <Grid item xs={12} md={6} key={input.name}>
//                                         <FormControl required={input.required}>
//                                             <FormLabel>{input.label}</FormLabel>
//                                             <RadioGroup name={input.name} value={values[input.name] || ''} onChange={handleChange}>
//                                                 {input.options.map((option) => (
//                                                     <FormControlLabel key={option.value} label={option.label} value={option.value} control={<Radio />} />
//                                                 ))}
//                                             </RadioGroup>
//                                             <FormHelperText>{input.helperText}</FormHelperText>
//                                         </FormControl>
//                                     </Grid>
//                                 );
//                             } else if (input.type === 'select') {
//                                 return (
//                                     <Grid item xs={12} md={6} key={input.name}>
//                                         <FormControl required={input.required} fullWidth>
//                                             <InputLabel>{input.label}</InputLabel>
//                                             <Select name={input.name} value={values[input.name] || ''} onChange={handleChange}>
//                                                 {input.options.map((option) => (
//                                                     <MenuItem key={option.value} value={option.value}>
//                                                         {option.label}
//                                                     </MenuItem>
//                                                 ))}
//                                             </Select>
//                                             <FormHelperText>{input.helperText}</FormHelperText>
//                                         </FormControl>
//                                     </Grid>
//                                 );
//                             } else if (input.type === 'checkbox') {
//                                 return (
//                                     <Grid item xs={12} md={6} key={input.name} >
//                                         <FormControlLabel
//                                             control={<Checkbox name={input.name} checked={values[input.name] || false} onChange={handleChange} />}
//                                             label={input.label}                                            
//                                         />
//                                     </Grid>
//                                 );
//                             } else if (input.type === 'multiselect') {
//                                 return (
//                                     <Grid item xs={12} md={6} key={input.name}>
//                                         <FormControl required={input.required} fullWidth>
//                                             <InputLabel>{input.label}</InputLabel>
//                                             <Select
//                                                 name={input.name}
//                                                 value={values[input.name] || []}
//                                                 onChange={(event) => {
//                                                     setValues({
//                                                         ...values,
//                                                         [input.name]: event.target.value,
//                                                     });
//                                                 }}
//                                                 multiple
//                                             >
//                                                 {input.options.map((option) => (
//                                                     <MenuItem key={option.value} value={option.value}>
//                                                         {option.label}
//                                                     </MenuItem>
//                                                 ))}
//                                             </Select>
//                                             <FormHelperText>{input.helperText}</FormHelperText>
//                                         </FormControl>
//                                     </Grid>
//                                 );
//                             }
//                             return null;
//                         })}
//                     </Grid>
//                     <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
//                         Submit
//                     </Button>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default FormBuilder;





import React from 'react';
import { Grid, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, FormHelperText, TextField, Select, MenuItem, InputLabel, Checkbox, FormGroup, Button, Typography } from '@mui/material';
import Header from '../Header';
import formData from './formData.json';  

const FormBuilder = ({ formDataProps = formData }) => {
    const [form, setForm] = React.useState(formDataProps);
    const [values, setValues] = React.useState({});
    const [isEditMode, setIsEditMode] = React.useState(false);
    const [editedLabels, setEditedLabels] = React.useState({});

    const handleChange = (event) => {
        setValues({
            ...values,
            [event.target.name]: event.target.type === 'checkbox' ? event.target.checked : event.target.value,
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(values);
    };

    const handleEditClick = () => {
        setIsEditMode(!isEditMode);
    };

    const handleLabelChange = (event, inputName) => {
        setEditedLabels({
            ...editedLabels,
            [inputName]: event.target.value,
        });
    };

    return (
        <div>
            <Header />
            <div className="container-md mb-5 mt-5">
                <h2 className='h2'> {form?.title} </h2>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        {form?.inputs?.map((input, index) => {
                            const isLastInputInRow = index % 2 === 1 && index !== form.inputs.length - 1;
                            const labelValue = isEditMode ? editedLabels[input.name] || input.label : input.label;

                            if (input.type === 'text' || input.type === 'email' || input.type === 'tel' || input.type === 'url' || input.type === 'website') {
                                return (
                                    <Grid item xs={12} md={6} key={input.name}>
                                        {isEditMode && (
                                            <TextField
                                                value={labelValue}
                                                onChange={(event) => handleLabelChange(event, input.name)}
                                                margin="dense"
                                                variant="outlined"
                                                fullWidth
                                            />
                                        )}
                                        {!isEditMode && <Typography variant="h6">{labelValue}</Typography>}
                                        <TextField
                                            label={labelValue}
                                            name={input.name}
                                            type={input.type}
                                            required={input.required}
                                            fullWidth
                                            value={values[input.name] || ''}
                                            onChange={handleChange}
                                            helperText={input.helperText}
                                        />
                                    </Grid>
                                );
                            } else if (input.type === 'date') {
                                return (
                                    <Grid item xs={12} md={6} key={input.name}>
                                        {isEditMode && (
                                            <TextField
                                                value={labelValue}
                                                onChange={(event) => handleLabelChange(event, input.name)}
                                                margin="dense"
                                                variant="outlined"
                                                fullWidth
                                            />
                                        )}
                                        {!isEditMode && <Typography variant="h6">{labelValue}</Typography>}
                                        <TextField
                                            label={labelValue}
                                            name={input.name}
                                            type="date"
                                            required={input.required}
                                            fullWidth
                                            value={values[input.name] || ''}
                                            onChange={handleChange}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
                                    </Grid>
                                );
                            } else if (input.type === 'textarea') {
                                return (
                                    <Grid item xs={12} md={6} key={input.name}>
                                        {isEditMode && (
                                            <TextField
                                                value={labelValue}
                                                onChange={(event) => handleLabelChange(event, input.name)}
                                                margin="dense"
                                                variant="outlined"
                                                fullWidth
                                            />
                                        )}
                                        {!isEditMode && <Typography variant="h6">{labelValue}</Typography>}
                                        <TextField
                                            label={labelValue}
                                            name={input.name}
                                            multiline
                                            rows={input.rows || 4}
                                            required={input.required}
                                            fullWidth
                                            value={values[input.name] || ''}
                                            onChange={handleChange}
                                            helperText={input.helperText}
                                        />
                                    </Grid>
                                );
                            } else if (input.type === 'radio') {
                                return (
                                    <Grid item xs={12} md={6} key={input.name}>
                                        {isEditMode && (
                                            <TextField
                                                value={labelValue}
                                                onChange={(event) => handleLabelChange(event, input.name)}
                                                margin="dense"
                                                variant="outlined"
                                                fullWidth
                                            />
                                        )}
                                        {!isEditMode && <Typography variant="h6">{labelValue}</Typography>}
                                        <FormControl required={input.required}>
                                            <FormLabel>{labelValue}</FormLabel>
                                            <RadioGroup name={input.name} value={values[input.name] || ''} onChange={handleChange}>
                                                {input.options.map((option) => (
                                                    <FormControlLabel key={option.value} label={option.label} value={option.value} control={<Radio />} />
                                                ))}
                                            </RadioGroup>
                                            <FormHelperText>{input.helperText}</FormHelperText>
                                        </FormControl>
                                    </Grid>
                                );
                            } else if (input.type === 'select') {
                                return (
                                    <Grid item xs={12} md={6} key={input.name}>
                                        {isEditMode && (
                                            <TextField
                                                value={labelValue}
                                                onChange={(event) => handleLabelChange(event, input.name)}
                                                margin="dense"
                                                variant="outlined"
                                                fullWidth
                                            />
                                        )}
                                        {!isEditMode && <Typography variant="h6">{labelValue}</Typography>}
                                        <FormControl required={input.required} fullWidth>
                                            <InputLabel>{labelValue}</InputLabel>
                                            <Select name={input.name} value={values[input.name] || ''} onChange={handleChange}>
                                                {input.options.map((option) => (
                                                    <MenuItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            <FormHelperText>{input.helperText}</FormHelperText>
                                        </FormControl>
                                    </Grid>
                                );
                            } else if (input.type === 'checkbox') {
                                return (
                                    <Grid item xs={12} md={6} key={input.name} >
                                        {isEditMode && (
                                            <TextField
                                                value={labelValue}
                                                onChange={(event) => handleLabelChange(event, input.name)}
                                                margin="dense"
                                                variant="outlined"
                                                fullWidth
                                            />
                                        )}
                                        {!isEditMode && <Typography variant="h6">{labelValue}</Typography>}
                                        <FormControlLabel
                                            control={<Checkbox name={
                                                input.name} checked={values[input.name] || false} onChange={handleChange} />}
                                            label={labelValue}

                                        />
                                    </Grid>
                                );
                            } else if (input.type === 'multiselect') {
                                return (
                                    <Grid item xs={12} md={6} key={input.name}>
                                        {isEditMode && (
                                            <TextField
                                                value={labelValue}
                                                onChange={(event) => handleLabelChange(event, input.name)}
                                                margin="dense"
                                                variant="outlined"
                                                fullWidth
                                            />
                                        )}
                                        {!isEditMode && <Typography variant="h6">{labelValue}</Typography>}
                                        <FormControl required={input.required} fullWidth>
                                            <InputLabel>{labelValue}</InputLabel>
                                            <Select
                                                name={input.name}
                                                value={values[input.name] || []}
                                                onChange={(event) => {
                                                    setValues({
                                                        ...values,
                                                        [input.name]: event.target.value,
                                                    });
                                                }}
                                                multiple
                                            >
                                                {input.options.map((option) => (
                                                    <MenuItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            <FormHelperText>{input.helperText}</FormHelperText>
                                        </FormControl>
                                    </Grid>
                                );
                            }
                            return null;
                        })}
                    </Grid>
                    <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                        Submit
                    </Button>
                    {isEditMode && (
                        <Button onClick={() => setForm({ ...form, inputs: form.inputs.map((input) => ({ ...input, label: editedLabels[input.name] || input.label })) })} variant="contained" color="primary" sx={{ mt: 2, ml: 2 }}>
                            Save
                        </Button>
                    )}
                    <Button onClick={handleEditClick} variant="contained" color="primary" sx={{ mt: 2, ml: 2 }}>
                        {isEditMode ? 'Cancel' : 'Edit'}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default FormBuilder;