export interface MasterSetting {
    banner_image:any;
    common:Common[];
    socialMedia:socialMedia[];
}


export interface Common {
    payment_gateway_charges:any;
    email_sms_charges:any;
    odbus_gst_charges:any;
    advance_days_show:any;
    support_email:any;
    booking_email:any;
    request_email:any;
    other_email:any;
    mobile_no_1:any;
    mobile_no_2:any;
    mobile_no_3:any;
    mobile_no_4:any;
    logo:any;
    operator_home_content:any;
    operator_slogan:any;
}


export interface socialMedia {
    id: any,
    user_id: any,
    facebook_link: any,
    twitter_link: any,
    instagram_link: any,
    googleplus_link: any,
    linkedin_link: any,
    created_at: any,
    updated_at: any,
    created_by: any,
    status: any
}


