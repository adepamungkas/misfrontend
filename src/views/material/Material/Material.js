import React, { Component } from 'react'
import {
    CButton,
    CBadge,
    CCard,
    CCardBody,
    CCardFooter,
    CCardHeader,
    CCol,
    CCollapse,
    CDropdownItem,
    CDropdownMenu,
    CDropdownToggle,
    CFade,
    CForm,
    CFormGroup,
    CFormText,
    CValidFeedback,
    CInvalidFeedback,
    CTextarea,
    CInput,
    CInputFile,
    CInputCheckbox,
    CInputRadio,
    CInputGroup,
    CInputGroupAppend,
    CInputGroupPrepend,
    CDropdown,
    CInputGroupText,
    CLabel,
    CSelect,
    CRow,
    CDataTable,
    CSwitch,
    CModal,
    CModalBody,
    CModalFooter,
    CModalHeader,
    CModalTitle,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { DocsLink } from 'src/reusable'
import Service from '../Service';
import swal from 'sweetalert';
import usersData from '../../users/UsersData'
import Select from 'react-select';

const moment = require('moment');
class Material extends Component {

    state = {
        types: [
            { value: "finish", label: "finish" },
            { value: "semi-finish", label: "semi-finish" },
            { value: "raw", label: "raw" },
        ],
        type: "",
        loading: false,
        isAutoCompleteLoading: false,
        color: "",
        description: "",
        vendor: "",
        name: "",
        size: 0,
        isBroken: false,
        trademark: "",
        date: new Date(),

        colorToEdit: "",
        descriptionToEdit: "",
        vendorToEdit: "",
        nameToEdit: "",
        sizeToEdit: 0,
        isBrokenToEdit: false,
        trademarkToEdit: "",
        dateToEdit: new Date(),

        isCreateLoading: false,
        success: false,
        danger: false,
        warning: false,
        tableData: [],
        validationEditForm: {},
        validationSearch: {},
        selectedMaterial: {}

    }

    constructor(props) {
        super(props);
        this.service = new Service();

    }

    componentDidMount() {
        //  this.setUnits();
        this.setData();
        console.log(this.state.tableData)
        console.log(usersData)

    }

    setData = () => {

        this.setState({ loadingData: true })
        this.service
            .getMaterials()
            .then((result) => {
                console.log(result.data);
                this.setState({ tableData: result.data, loadingData: false })
            });
    }

    search = () => {
        this.setData();
    }


    reset = () => {
        this.setState({ name: "", vendor: "" })
    }
    getBadge = status => {
        switch (status) {
            case 'finish': return 'success'
            case 'semi-finish': return 'secondary'
            case 'raw': return 'warning'
            case 'Banned': return 'danger'
            default: return 'primary'
        }
    }

    showAddModal = (value) => {

        this.setState({ success: value });
        this.resetCreateModal()
    }

    resetCreateModal = () => {
        this.setState({ validationCreateForm: {} })
    }
    showEditModal = (value) => {

        this.setState({ warning: value });
    }

    showDeleteModal = (value) => {

        this.setState({ danger: value });
    }

    checkErrorDataCreate = () => {
        let errors = {}

        if (this.state.size == 0) {
            errors.size = "size is Required"
        }

        if (this.state.vendor == null || this.state.vendor == "") {
            errors.vendor = "vendor is Required"
        }

        if (this.state.color == null || this.state.color == "") {
            errors.vendor = "vendor is Required"
        }

        if (this.state.name == null || this.state.name === "") {
            errors.name = "name is Required"
        }

        return errors
    }

    isEmptyObject(obj) {
        return JSON.stringify(obj) === '{}';
    }

    handleCreateMaterial = () => {
        this.setState({ validationCreateForm: {} })
        let errors = this.checkErrorDataCreate()
        this.setState({ validationCreateForm: errors })

        if (this.isEmptyObject(errors)) {
            this.postMaterial()
        }

    }

    postMaterial = () => {

        this.setState({ validationCreateForm: {} })

        const payload = {
            Name: this.state.name,
            InputBy: this.state.inputBy,
            IsBroken: false,
            Date: moment(this.state.date).format("YYYY-MM-DD hh:ss"),
            // Date: this.state.date && this.state.date != "Invalid date" ? moment(this.state.date).format("YYYY-MM-DD") : null,
            Description: this.state.description,
            Trademark: this.state.trademark,
            Vendor: this.state.vendor,
            Color: this.state.color,
            Size: this.state.size,
            Type: this.state.type.value,
            IsBroken: this.state.isBroken,
            validationCreateForm: {}
        }


        this.service.createMaterial(payload)
            .then((result) => {
                swal({
                    icon: 'success',
                    title: 'Good...',
                    text: 'Data berhasil disimpan!'
                })

                this.setState({ isCreateLoading: false }, () => {

                    // this.resetPagingConfiguration();
                    this.setData();
                    this.showAddModal(false);
                });
            })
            .catch((error) => {
                if (error) {
                    let message = ""
                    this.setState({ isCreateLoading: false, validationCreateForm: error });
                    swal({
                        icon: 'error',
                        title: 'Oops...',
                        text: message
                    });
                }
            });
    }



    handleDeleteClick = (item) => {
        console.log("item", item)
        this.setState({ selectedMaterial: item }, () => {
            this.showDeleteModal(true);
        })
    }

    handleEditClick = (item) => {
        console.log("item", item)
        this.setState({
            selectedMaterial: item,
            nameToEdit: item.Name,
            descriptionToEdit:item.Description,
            dateToEdit: item.Date,
            colorToEdit: item.Color,
            vendorToEdit: item.Vendor,
            sizeToEdit: item.Size,
            trademarkToEdit: item.Trademark,
            isBrokenToEdit: item.IsBroken
        }, () => {
            this.showEditModal(true);
        })
    }

    handleDelete = () => {
        // this.setState({ isDeleteOvertimeLoading: true })

        this.service.deleteMaterial(this.state.selectedMaterial?.ID)
            .then(() => {

                swal({
                    icon: 'success',
                    title: 'Good...',
                    text: 'Data berhasil dihapus!'
                })
                this.setState({ selectedMaterial: null }, () => {

                    // this.resetPagingConfiguration();
                    this.setData();
                    this.showDeleteModal(false);
                });
            })
    }

    handleEdit = () => {

        const payload = {
            Name: this.state.name,
            InputBy: this.state.inputBy,
            IsBroken: false,
            Date: this.state.dateToEdit,
            Description: this.state.descriptionToEdit,
            Trademark: this.state.trademarkToEdit,
            Vendor: this.state.vendorToEdit,
            Color: this.state.colorToEdit,
            Size: this.state.sizeToEdit,
            Type: this.state.type.value,
            IsBroken: this.state.isBrokenToEdit,
        }

        // this.setState({ isDeleteOvertimeLoading: true })
        this.service.editMaterial(this.state.selectedMaterial?.ID, payload)
            .then(() => {

                swal({
                    icon: 'success',
                    title: 'Good...',
                    text: 'Data berhasil dihapus!'
                })
                this.setState({ selectedMaterial: null }, () => {

                    this.setData();
                    this.showEditModal(false);
                });
            })
    }


    render() {

        const { tableData } = this.state;

        const fields = ['ID', 'Date', 'Description', 'Name', 'Color', 'Size', 'Trademark', 'Vendor', 'Type', 'Edit', 'Delete']

        return (

            <>
                <CRow>
                    <CCol xs="12" md="6">
                        <CCard>
                            <CCardHeader>
                                Filter Data
              <small> Material</small>
                            </CCardHeader>
                            <CCardBody>
                                <CForm action="" method="post" encType="multipart/form-data" className="form-horizontal">

                                    <CFormGroup row>
                                        <CCol md="3">
                                            <CLabel htmlFor="text-input">Name Material</CLabel>
                                        </CCol>
                                        <CCol xs="12" md="9">
                                            <CInput
                                                id="text-input"
                                                name="name"
                                                value={this.state.name}
                                                placeholder="Name Material"
                                                onChange={(event) => {
                                                    console.log(event.target.value)
                                                    this.setState({ name: event.target.value })
                                                }

                                                }
                                            />

                                            {/* <CFormText>Plaese type name material</CFormText> */}
                                        </CCol>
                                    </CFormGroup>
                                    <CFormGroup row>
                                        <CCol md="3">
                                            <CLabel htmlFor="email-input">Vendor Name</CLabel>
                                        </CCol>
                                        <CCol xs="12" md="9">
                                            <CInput type="text" value={this.state.vendor} id="vendor-input"
                                                onChange={(event) => {
                                                    this.setState({ vendor: event.target.value })
                                                }}
                                                name="vendor" placeholder="Enter Vendor Name" autoComplete="email" />
                                            {/* <CFormText className="help-block">Please enter vendor name</CFormText> */}
                                        </CCol>
                                    </CFormGroup>

                                    <CFormGroup row>
                                        <CCol md="3">
                                            <CLabel htmlFor="date-input">Date Input</CLabel>
                                        </CCol>
                                        <CCol xs="5" md="4">
                                            <CInput type="date" id="date-input" name="date-input" placeholder="date" />
                                        </CCol>
                                        <CCol xs="2" md="1">
                                            <CLabel htmlFor="date-input"> - </CLabel>
                                        </CCol>
                                        <CCol xs="5" md="4">
                                            <CInput type="date" id="date-input" name="date-input" placeholder="date" />
                                        </CCol>

                                    </CFormGroup>





                                </CForm>
                            </CCardBody>
                            <CCardFooter>

                                <CButton type="reset" size="sm" color="warning" onClick={() => this.reset()} ><CIcon /> Reset</CButton>
                                <CButton type="submit" size="sm" color="primary" onClick={() => this.search()}><CIcon name="cil-search" /> Cari</CButton>
                                <CButton type="submit" size="sm" color="success" onClick={() => this.showAddModal(true)}><CIcon name="cil-plus" /> Tambah Data</CButton>

                            </CCardFooter>
                        </CCard>

                    </CCol>
                </CRow>
                <CModal
                    show={this.state.success}
                    onClose={() => this.showAddModal(false)}
                    color="success"
                    size={"lg"}
                >
                    <CModalHeader closeButton>
                        <CModalTitle>Input New Material</CModalTitle>
                    </CModalHeader>
                    <CModalBody>

                        <CRow>
                            <CCol>
                                <CCard>
                                    <CCardHeader>
                                        Form Input
              <small>  Material</small>
                                    </CCardHeader>
                                    <CCardBody>
                                        <CForm action="" method="post" encType="multipart/form-data" className="form-horizontal">

                                            <CFormGroup row>
                                                <CCol md="3">
                                                    <CLabel htmlFor="email-input">Name Material</CLabel>
                                                </CCol>
                                                <CCol xs="12" md="9">
                                                    <CInput
                                                        type="text"
                                                        id="name"

                                                        //  invalid={this.state.validationCreateForm?.name =="" ? true:false}
                                                        name="name"
                                                        placeholder="Enter Name Material"
                                                        // autoComplete="on"
                                                        value={this.state.name}
                                                        onChange={(event) => {
                                                            console.log(event.target.value)
                                                            this.setState({ name: event.target.value })
                                                        }
                                                        }
                                                    />

                                                    <span style={{ color: "red" }}>{this.state.validationCreateForm?.name} </span>

                                                </CCol>
                                            </CFormGroup>
                                            <CFormGroup row>
                                                <CCol md="3">
                                                    <CLabel htmlFor="password-input">Colors</CLabel>
                                                </CCol>
                                                <CCol xs="12" md="9">
                                                    <CInput
                                                        type="text"
                                                        id="color"
                                                        name="color-input"
                                                        placeholder="Enter color material "
                                                        autoComplete="color-input"
                                                        onChange={(event) => {

                                                            this.setState({ color: event.target.value })
                                                        }
                                                        }
                                                    />
                                                    <span style={{ color: "red" }}>{this.state.validationCreateForm?.color} </span>

                                                </CCol>
                                            </CFormGroup>
                                            <CFormGroup row>
                                                <CCol md="3">
                                                    <CLabel htmlFor="password-input">Size</CLabel>
                                                </CCol>
                                                <CCol xs="12" md="9">
                                                    <CInput
                                                        type="number"
                                                        id="size"
                                                        name="size"
                                                        placeholder="Enter size material "
                                                        autoComplete="color-input"
                                                        onChange={(event) => {

                                                            this.setState({ size: event.target.value })
                                                        }
                                                        }
                                                    />
                                                    <span style={{ color: "red" }}>{this.state.validationCreateForm?.size} </span>

                                                </CCol>
                                            </CFormGroup>

                                            <CFormGroup row>
                                                <CCol md="3">
                                                    <CLabel htmlFor="password-input">Vendor</CLabel>
                                                </CCol>
                                                <CCol xs="12" md="9">
                                                    <CInput
                                                        type="text"
                                                        id="vendor"
                                                        name="vendor"
                                                        placeholder="Enter vendor material "
                                                        autoComplete="vendor"
                                                        onChange={(event) => {

                                                            this.setState({ vendor: event.target.value })
                                                        }
                                                        }
                                                    />
                                                    <span style={{ color: "red" }}>{this.state.validationCreateForm?.vendor} </span>

                                                </CCol>
                                            </CFormGroup>
                                            <CFormGroup row>
                                                <CCol md="3">
                                                    <CLabel htmlFor="password-input">Trademark</CLabel>
                                                </CCol>
                                                <CCol xs="12" md="9">
                                                    <CInput
                                                        type="text"
                                                        id="Trademark"
                                                        name="Trademark"
                                                        placeholder="Enter Trademark material "
                                                        autoComplete="Trademark"
                                                        onChange={(event) => {

                                                            this.setState({ trademark: event.target.value })
                                                        }
                                                        }
                                                    />
                                                    <span style={{ color: "red" }}>{this.state.validationCreateForm?.trademark} </span>

                                                </CCol>
                                            </CFormGroup>
                                            <CFormGroup row>
                                                <CCol md="3">
                                                    <CLabel htmlFor="date-input">Date Input</CLabel>
                                                </CCol>
                                                <CCol xs="12" md="9">
                                                    <CInput
                                                        type="date"
                                                        id="date-input"
                                                        name="date"
                                                        placeholder="date"
                                                        value={moment(this.state.date).format("YYYY-MM-DD")}
                                                        onChange={(event) => {
                                                            this.setState({ date: event.target.value })
                                                        }}

                                                    />
                                                </CCol>
                                            </CFormGroup>

                                            <CFormGroup row>
                                                <CCol md="3">
                                                    <CLabel htmlFor="textarea-input">Description</CLabel>
                                                </CCol>
                                                <CCol xs="12" md="9">
                                                    <CTextarea
                                                        name="textarea-input"
                                                        id="textarea-input"
                                                        rows="9"
                                                        placeholder="Content..."
                                                        onChange={(event) => {
                                                            this.setState({ description: event.target.value })
                                                        }
                                                        }
                                                    />
                                                </CCol>
                                            </CFormGroup>
                                            <CFormGroup row>
                                                <CCol md="3">
                                                    <CLabel htmlFor="select">Select type material</CLabel>
                                                </CCol>
                                                <CCol xs="12" md="9">

                                                    <Select
                                                        placeholder={'select type material'}
                                                        isClearable={true}
                                                        options={this.state.types}
                                                        value={this.state.type}
                                                        onChange={(event) => {
                                                            this.setState({ type: event });
                                                        }} />

                                                    <span style={{ color: "red" }}>{this.state.validationCreateForm?.type} </span>
                                                </CCol>
                                            </CFormGroup>



                                        </CForm>
                                    </CCardBody>
                                    <CCardFooter>


                                    </CCardFooter>
                                </CCard>

                            </CCol>
                        </CRow>

                    </CModalBody>
                    <CModalFooter>
                        <CButton color="success" onClick={this.handleCreateMaterial} >Submit</CButton>{' '}
                        <CButton color="secondary" onClick={() => this.showAddModal(false)}>Cancel</CButton>
                    </CModalFooter>
                </CModal>

                <CModal
                    size={"lg"}
                    show={this.state.warning}
                    onClose={() => this.showEditModal(false)}
                    color="warning"
                >
                    <CModalHeader closeButton>
                        <CModalTitle>Edit Material</CModalTitle>
                    </CModalHeader>
                    <CModalBody>

                        <CRow>
                            <CCol>
                                <CCard>
                                    <CCardHeader>
                                        Form Edit
              <small>  Material</small>
                                    </CCardHeader>
                                    <CCardBody>
                                        <CForm action="" method="post" encType="multipart/form-data" className="form-horizontal">

                                            <CFormGroup row>
                                                <CCol md="3">
                                                    <CLabel htmlFor="email-input">Name Material</CLabel>
                                                </CCol>
                                                <CCol xs="12" md="9">
                                                    <CInput
                                                        type="text"
                                                        id="name-input"
                                                        name="name"
                                                        placeholder="Enter Name Material"
                                                        // autoComplete="on"
                                                        value={this.state.nameToEdit}
                                                        onChange={(event) => {
                                                            console.log(event.target.value)
                                                            this.setState({ nameToEdit: event.target.value })
                                                        }
                                                        }
                                                    />
                                                    {/* <CFormText className="help-block">*Required</CFormText> */}
                                                </CCol>
                                            </CFormGroup>
                                            <CFormGroup row>
                                                <CCol md="3">
                                                    <CLabel htmlFor="password-input">Colors</CLabel>
                                                </CCol>
                                                <CCol xs="12" md="9">
                                                    <CInput
                                                        type="text"
                                                        id="color"
                                                        name="color-input"
                                                        placeholder="Enter color material "
                                                        autoComplete="color-input"
                                                        value={this.state.colorToEdit}
                                                        onChange={(event) => {

                                                            this.setState({ colorToEdit: event.target.value })
                                                        }
                                                        }
                                                    />
                                                    {/* <CFormText className="help-block">*Required</CFormText> */}
                                                </CCol>
                                            </CFormGroup>
                                            <CFormGroup row>
                                                <CCol md="3">
                                                    <CLabel htmlFor="password-input">Size</CLabel>
                                                </CCol>
                                                <CCol xs="12" md="9">
                                                    <CInput
                                                        type="number"
                                                        id="size"
                                                        name="size"
                                                        placeholder="Enter size material "
                                                        autoComplete="color-input"
                                                        value={this.state.sizeToEdit}
                                                        onChange={(event) => {

                                                            this.setState({ sizeToEdit: event.target.value })
                                                        }
                                                        }
                                                    />
                                                    {/* <CFormText className="help-block">*Required</CFormText> */}
                                                </CCol>
                                            </CFormGroup>

                                            <CFormGroup row>
                                                <CCol md="3">
                                                    <CLabel htmlFor="password-input">Vendor</CLabel>
                                                </CCol>
                                                <CCol xs="12" md="9">
                                                    <CInput
                                                        type="text"
                                                        id="vendor"
                                                        name="vendor"
                                                        placeholder="Enter vendor material "
                                                        autoComplete="vendor"
                                                        value={this.state.vendorToEdit}
                                                        onChange={(event) => {

                                                            this.setState({ vendorToEdit: event.target.value })
                                                        }
                                                        }
                                                    />
                                                    {/* <CFormText className="help-block">*Required</CFormText> */}
                                                </CCol>
                                            </CFormGroup>
                                            <CFormGroup row>
                                                <CCol md="3">
                                                    <CLabel htmlFor="password-input">Trademark</CLabel>
                                                </CCol>
                                                <CCol xs="12" md="9">
                                                    <CInput
                                                        type="text"
                                                        id="Trademark"
                                                        name="Trademark"
                                                        placeholder="Enter Trademark material "
                                                        autoComplete="Trademark"
                                                        value={this.state.trademarkToEdit}
                                                        onChange={(event) => {

                                                            this.setState({ trademarkToEdit: event.target.value })
                                                        }
                                                        }
                                                    />
                                                    {/* <CFormText className="help-block">*Required</CFormText> */}
                                                </CCol>
                                            </CFormGroup>
                                            <CFormGroup row>
                                                <CCol md="3">
                                                    <CLabel htmlFor="date-input">Date Input</CLabel>
                                                </CCol>
                                                <CCol xs="12" md="9">
                                                    <CInput
                                                        type="date"
                                                        id="date-input"
                                                        name="date"
                                                        placeholder="date"
                                                        value={moment(this.state.dateToEdit).format("YYYY-MM-DD")}
                                                        onChange={(event) => {
                                                            this.setState({ dateToEdit: event.target.value })
                                                        }}

                                                    />
                                                </CCol>
                                            </CFormGroup>

                                            <CFormGroup row>
                                                <CCol md="3">
                                                    <CLabel htmlFor="textarea-input">Description</CLabel>
                                                </CCol>
                                                <CCol xs="12" md="9">
                                                    <CTextarea
                                                        name="textarea-input"
                                                        id="textarea-input"
                                                        rows="9"
                                                        value={this.state.descriptionToEdit}
                                                        placeholder="Content..."
                                                        onChange={(event) => {
                                                            this.setState({ descriptionToEdit: event.target.value })
                                                        }
                                                        }
                                                    />
                                                </CCol>
                                            </CFormGroup>
                                            <CFormGroup row>
                                                <CCol md="3">
                                                    <CLabel htmlFor="select">Select type material</CLabel>
                                                </CCol>
                                                <CCol xs="12" md="9">

                                                    <Select
                                                        placeholder={'pilih unit'}
                                                        isClearable={true}
                                                        options={this.state.types}
                                                        value={this.state.type}
                                                        onChange={(event) => {
                                                            this.setState({ type: event.value });
                                                        }} />


                                                </CCol>
                                            </CFormGroup>



                                        </CForm>
                                    </CCardBody>
                                    <CCardFooter>


                                    </CCardFooter>
                                </CCard>

                            </CCol>
                        </CRow>

                    </CModalBody>
                    <CModalFooter>
                        <CButton color="warning" onClick={() => this.handleEdit()}>Submit</CButton>{' '}
                        <CButton color="secondary" onClick={() => this.showEditModal(false)}>Cancel</CButton>
                    </CModalFooter>
                </CModal>


                <CModal
                    show={this.state.danger}
                    onClose={() => this.showDeleteModal(false)}
                    color="danger"
                >
                    <CModalHeader closeButton>
                        <CModalTitle>Delete Data</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        Are you sure to delete this data?
              </CModalBody>
                    <CModalFooter>
                        <CButton color="danger" onClick={() => this.handleDelete()}>OK</CButton>{' '}
                        <CButton color="secondary" onClick={() => this.showDeleteModal(false)}>Cancel</CButton>
                    </CModalFooter>
                </CModal>


                <CRow>
                    <CCol xs="12" lg="12">
                        <CCard>
                            <CCardHeader>
                                 Table Material
                            </CCardHeader>
                            <CCardBody>
                                <CDataTable
                                    items={tableData}
                                    fields={fields}
                                    striped
                                    itemsPerPage={5}
                                    pagination
                                    // columnFilter
                                    hover
                                    // footer
                                    sorter
                                    tableFilter
                                    scopedSlots={{
                                        'Type':
                                            (item) => (
                                                <td>
                                                    <CBadge color={this.getBadge(item.Type)}>
                                                        {item.Type}
                                                    </CBadge>
                                                </td>
                                            ),
                                        'Edit':
                                            (item) => (
                                                <td>
                                                    <CButton type="submit" size="sm" color="warning" onClick={() => this.handleEditClick(item)}> Edit</CButton>

                                                </td>
                                            ),

                                        'Delete':
                                            (item) => (
                                                <td>
                                                    <CButton type="submit" size="sm" color="danger" onClick={() => this.handleDeleteClick(item)}> Delete</CButton>

                                                </td>
                                            )

                                    }}

                                />
                            </CCardBody>
                        </CCard>
                    </CCol>
                </CRow>

            </>
        )
    }


}

export default Material;