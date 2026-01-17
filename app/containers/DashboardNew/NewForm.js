import React, { Component } from 'react';
import './Obituaryform.css';

class New extends Component {
    constructor(props) {
        super(props);
        
        const { obituary } = props;
        this.state = {
            formData: {
                firstName: obituary?.firstName || '',
                middleName: obituary?.middleName || '',
                lastName: obituary?.lastName || '',
                maidenName: obituary?.maidenName || '',
                deceasedDate: obituary?.deceasedDate ? obituary.deceasedDate.split('T')[0] : '',
                birthDate: obituary?.birthDate ? obituary.birthDate.split('T')[0] : '',
                townCityOfResidence: obituary?.townCityOfResidence || '',
                obituaryText: obituary?.obituaryText || '',
                obituaryDisposition: obituary?.obituaryDisposition || '',
                finalRestingPlace: obituary?.finalRestingPlace || '',
                doNotPublishDeceasedDate: obituary?.doNotPublishDeceasedDate || false,
                doNotPublishDateOfBirth: obituary?.doNotPublishDateOfBirth || false,
                includeLiveStreaming: obituary?.includeLiveStreaming || false,
                rsvpToServices: obituary?.rsvpToServices || false,
                familyLogonEnabled: obituary?.familyLogonEnabled || false,
                guestbookType: obituary?.guestbookType || 'Public',
                notificationOption: obituary?.notificationOption || 'announce',
                noSocialSharingLinks: obituary?.noSocialSharingLinks || false,
                isPublished: obituary?.isPublished || false
            },
            photographs: [],
            backgroundImage: null,
            tributeVideo: null,
            recordingOfService: null,
            programServicePdf: null,
            backgroundMusic: null,
            submitting: false
        };
    }

    handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        this.setState({
            formData: {
                ...this.state.formData,
                [name]: type === 'checkbox' ? checked : value
            }
        });
    };

    handleFileChange = (e, fieldName) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            if (fieldName === 'photographs') {
                this.setState({ [fieldName]: Array.from(files) });
            } else {
                this.setState({ [fieldName]: files[0] });
            }
        }
    };

    handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate required fields
        if (!this.state.formData.firstName || !this.state.formData.lastName) {
            alert('First Name and Last Name are required!');
            return;
        }

        this.setState({ submitting: true });

        const formData = new FormData();
        
        // Add all text fields
        Object.keys(this.state.formData).forEach(key => {
            formData.append(key, this.state.formData[key]);
        });

        // Add photographs (multiple files)
        if (this.state.photographs.length > 0) {
            this.state.photographs.forEach(photo => {
                formData.append('photographs', photo);
            });
        }

        // Add single files
        if (this.state.backgroundImage) {
            formData.append('backgroundImage', this.state.backgroundImage);
        }
        if (this.state.tributeVideo) {
            formData.append('tributeVideo', this.state.tributeVideo);
        }
        if (this.state.recordingOfService) {
            formData.append('recordingOfService', this.state.recordingOfService);
        }
        if (this.state.programServicePdf) {
            formData.append('programServicePdf', this.state.programServicePdf);
        }
        if (this.state.backgroundMusic) {
            formData.append('backgroundMusic', this.state.backgroundMusic);
        }

        const success = await this.props.onSave(formData);
        
        this.setState({ submitting: false });
        
        if (!success) {
            // Error handling is done in parent component
        }
    };

    render() {
        const { formData, submitting, photographs, backgroundImage, tributeVideo, recordingOfService, programServicePdf, backgroundMusic } = this.state;
        const { obituary, onCancel } = this.props;

        return (
            <div className="obituary-form-container">
                <div className="form-header">
                    <h1>{obituary ? 'Edit Obituary' : 'Add Obituary'}</h1>
                    <div className="publish-status">
                        <input
                            type="checkbox"
                            id="isPublished"
                            name="isPublished"
                            checked={formData.isPublished}
                            onChange={this.handleChange}
                        />
                        <label htmlFor="isPublished">
                            Publish Obituary (uncheck if a draft begins...)
                        </label>
                    </div>
                </div>

                <form onSubmit={this.handleSubmit} className="obituary-form">
                    {/* Basic Information */}
                    <div className="form-section">
                        <div className="form-row">
                            <div className="form-field">
                                <label>First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={this.handleChange}
                                    required
                                />
                            </div>
                            <div className="form-field">
                                <label>Middle</label>
                                <input
                                    type="text"
                                    name="middleName"
                                    value={formData.middleName}
                                    onChange={this.handleChange}
                                />
                            </div>
                            <div className="form-field">
                                <label>Last</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={this.handleChange}
                                    required
                                />
                            </div>
                            <div className="form-field">
                                <label>Maiden Name</label>
                                <input
                                    type="text"
                                    name="maidenName"
                                    value={formData.maidenName}
                                    onChange={this.handleChange}
                                    placeholder="if applicable"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Dates */}
                    <div className="form-section">
                        <div className="form-row">
                            <div className="form-field">
                                <label>Deceased Date</label>
                                <input
                                    type="date"
                                    name="deceasedDate"
                                    value={formData.deceasedDate}
                                    onChange={this.handleChange}
                                />
                                <div className="checkbox-wrapper">
                                    <input
                                        type="checkbox"
                                        id="doNotPublishDeceasedDate"
                                        name="doNotPublishDeceasedDate"
                                        checked={formData.doNotPublishDeceasedDate}
                                        onChange={this.handleChange}
                                    />
                                    <label htmlFor="doNotPublishDeceasedDate">
                                        Do not publish deceased date
                                    </label>
                                </div>
                            </div>

                            <div className="form-field">
                                <label>Birth Date</label>
                                <input
                                    type="date"
                                    name="birthDate"
                                    value={formData.birthDate}
                                    onChange={this.handleChange}
                                />
                                <div className="checkbox-wrapper">
                                    <input
                                        type="checkbox"
                                        id="doNotPublishDateOfBirth"
                                        name="doNotPublishDateOfBirth"
                                        checked={formData.doNotPublishDateOfBirth}
                                        onChange={this.handleChange}
                                    />
                                    <label htmlFor="doNotPublishDateOfBirth">
                                        Do not publish date of birth
                                    </label>
                                </div>
                                <small className="field-note">
                                    Show the public info (date only) if is it family is connected about identify them)
                                </small>
                            </div>

                            <div className="form-field">
                                <label>Town / City of residence (optional)</label>
                                <input
                                    type="text"
                                    name="townCityOfResidence"
                                    value={formData.townCityOfResidence}
                                    onChange={this.handleChange}
                                />
                                <small className="field-note">
                                    If you use this field, the town will be displayed in the obituary listings, under the decedent's name.
                                </small>
                            </div>
                        </div>
                    </div>

                    {/* Obituary Text */}
                    <div className="form-section">
                        <div className="form-field full-width">
                            <label>Obituary Text / Death Notice</label>
                            <textarea
                                name="obituaryText"
                                value={formData.obituaryText}
                                onChange={this.handleChange}
                                rows="10"
                                placeholder="The service details section is now after the obituary text area"
                            />
                        </div>
                    </div>

                    {/* Obituary Disposition */}
                    <div className="form-section">
                        <div className="form-row">
                            <div className="form-field">
                                <label>Obituary Disposition</label>
                                <div className="radio-group">
                                    <label className="radio-label">
                                        <input
                                            type="radio"
                                            name="obituaryDisposition"
                                            value="Burial"
                                            checked={formData.obituaryDisposition === 'Burial'}
                                            onChange={this.handleChange}
                                        />
                                        Burial
                                    </label>
                                    <label className="radio-label">
                                        <input
                                            type="radio"
                                            name="obituaryDisposition"
                                            value="Cremation"
                                            checked={formData.obituaryDisposition === 'Cremation'}
                                            onChange={this.handleChange}
                                        />
                                        Cremation
                                    </label>
                                </div>
                            </div>

                            <div className="form-field">
                                <label>Obituary Final Resting Place</label>
                                <input
                                    type="text"
                                    name="finalRestingPlace"
                                    value={formData.finalRestingPlace}
                                    onChange={this.handleChange}
                                    placeholder="None Selected"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Services */}
                    <div className="form-section">
                        <div className="section-title">Services</div>
                        <div className="checkbox-row">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    name="includeLiveStreaming"
                                    checked={formData.includeLiveStreaming}
                                    onChange={this.handleChange}
                                />
                                Include Live Streaming
                            </label>
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    name="rsvpToServices"
                                    checked={formData.rsvpToServices}
                                    onChange={this.handleChange}
                                />
                                RSVP to Services ℹ️
                            </label>
                        </div>
                    </div>

                    {/* Family Logon */}
                    <div className="form-section">
                        <div className="section-title">Family Logon</div>
                        <div className="radio-group inline">
                            <label className="radio-label">
                                <input
                                    type="radio"
                                    name="familyLogonEnabled"
                                    value="false"
                                    checked={!formData.familyLogonEnabled}
                                    onChange={() => this.setState({
                                        formData: { ...formData, familyLogonEnabled: false }
                                    })}
                                />
                                Disabled
                            </label>
                            <label className="radio-label">
                                <input
                                    type="radio"
                                    name="familyLogonEnabled"
                                    value="true"
                                    checked={formData.familyLogonEnabled}
                                    onChange={() => this.setState({
                                        formData: { ...formData, familyLogonEnabled: true }
                                    })}
                                />
                                Enabled
                            </label>
                        </div>
                    </div>

                    {/* Guestbook */}
                    <div className="form-section">
                        <div className="section-title">Guestbook</div>
                        <div className="radio-group inline">
                            <label className="radio-label">
                                <input
                                    type="radio"
                                    name="guestbookType"
                                    value="Public"
                                    checked={formData.guestbookType === 'Public'}
                                    onChange={this.handleChange}
                                />
                                Public
                            </label>
                            <label className="radio-label">
                                <input
                                    type="radio"
                                    name="guestbookType"
                                    value="Private"
                                    checked={formData.guestbookType === 'Private'}
                                    onChange={this.handleChange}
                                />
                                Private
                            </label>
                            <label className="radio-label">
                                <input
                                    type="radio"
                                    name="guestbookType"
                                    value="None"
                                    checked={formData.guestbookType === 'None'}
                                    onChange={this.handleChange}
                                />
                                None
                            </label>
                        </div>
                    </div>

                    {/* Media Uploads */}
                    <div className="form-section">
                        <div className="section-title">Media Files</div>
                        
                        <div className="file-upload-row">
                            <div className="file-upload-field">
                                <label>Tribute Video</label>
                                <div className="file-input-wrapper">
                                    <input
                                        type="file"
                                        id="tributeVideo"
                                        accept="video/*"
                                        onChange={(e) => this.handleFileChange(e, 'tributeVideo')}
                                    />
                                    <label htmlFor="tributeVideo" className="file-label">
                                        📹 {tributeVideo ? tributeVideo.name : 'Manage...'}
                                    </label>
                                </div>
                            </div>

                            <div className="file-upload-field">
                                <label>Recording of Service</label>
                                <div className="file-input-wrapper">
                                    <input
                                        type="file"
                                        id="recordingOfService"
                                        accept="video/*"
                                        onChange={(e) => this.handleFileChange(e, 'recordingOfService')}
                                    />
                                    <label htmlFor="recordingOfService" className="file-label">
                                        📹 {recordingOfService ? recordingOfService.name : 'Manage...'}
                                    </label>
                                </div>
                            </div>

                            <div className="file-upload-field">
                                <label>Program/Service PDF</label>
                                <div className="file-input-wrapper">
                                    <input
                                        type="file"
                                        id="programServicePdf"
                                        accept=".pdf"
                                        onChange={(e) => this.handleFileChange(e, 'programServicePdf')}
                                    />
                                    <label htmlFor="programServicePdf" className="file-label">
                                        📄 {programServicePdf ? programServicePdf.name : 'Manage...'}
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="file-upload-row">
                            <div className="file-upload-field">
                                <label>Background Music</label>
                                <div className="file-input-wrapper">
                                    <input
                                        type="file"
                                        id="backgroundMusic"
                                        accept="audio/*"
                                        onChange={(e) => this.handleFileChange(e, 'backgroundMusic')}
                                    />
                                    <label htmlFor="backgroundMusic" className="file-label">
                                        🎵 {backgroundMusic ? backgroundMusic.name : 'Not selected...'}
                                    </label>
                                </div>
                            </div>

                            <div className="file-upload-field">
                                <label>Photograph(s)</label>
                                <div className="file-input-wrapper">
                                    <input
                                        type="file"
                                        id="photographs"
                                        accept="image/*"
                                        multiple
                                        onChange={(e) => this.handleFileChange(e, 'photographs')}
                                    />
                                    <label htmlFor="photographs" className="file-label">
                                        📷 {photographs.length > 0 ? `${photographs.length} file(s) selected` : 'No photos added...'}
                                    </label>
                                </div>
                            </div>

                            <div className="file-upload-field">
                                <label>Background Image</label>
                                <div className="file-input-wrapper">
                                    <input
                                        type="file"
                                        id="backgroundImage"
                                        accept="image/*"
                                        onChange={(e) => this.handleFileChange(e, 'backgroundImage')}
                                    />
                                    <label htmlFor="backgroundImage" className="file-label">
                                        🖼️ {backgroundImage ? backgroundImage.name : 'None...'}
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notification Option */}
                    <div className="form-section">
                        <div className="section-title">Notification Option</div>
                        <div className="radio-group inline">
                            <label className="radio-label">
                                <input
                                    type="radio"
                                    name="notificationOption"
                                    value="announce"
                                    checked={formData.notificationOption === 'announce'}
                                    onChange={this.handleChange}
                                />
                                Announce to obituary alert subscribers
                            </label>
                            <label className="radio-label">
                                <input
                                    type="radio"
                                    name="notificationOption"
                                    value="doNotAnnounce"
                                    checked={formData.notificationOption === 'doNotAnnounce'}
                                    onChange={this.handleChange}
                                />
                                Do not announce to obituary alert subscribers
                            </label>
                        </div>
                    </div>

                    {/* Options */}
                    <div className="form-section">
                        <div className="section-title">Options</div>
                        <div className="checkbox-wrapper">
                            <input
                                type="checkbox"
                                id="noSocialSharingLinks"
                                name="noSocialSharingLinks"
                                checked={formData.noSocialSharingLinks}
                                onChange={this.handleChange}
                            />
                            <label htmlFor="noSocialSharingLinks">
                                No Social Sharing Links
                            </label>
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="form-actions">
                        <button 
                            type="button" 
                            className="btn-cancel"
                            onClick={onCancel}
                            disabled={submitting}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="btn-save"
                            disabled={submitting}
                        >
                            {submitting ? 'Saving...' : 'Save Obituary'}
                        </button>
                    </div>
                </form>
            </div>
        );
    }
}

export default New;