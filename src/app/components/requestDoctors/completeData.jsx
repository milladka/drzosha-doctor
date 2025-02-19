import AxiosInstance from "@/app/config/axiosInstance";
import { addNotification } from "@/app/store/notificationStore";
import DynamicSelect from "@/app/utils/dynamicSelect";
import { LoadingButton } from "@/app/utils/loadingButton";
import { LoadingIcon } from "@/app/utils/loadingIcon";
import { useEffect, useState } from "react"
import { Camera, User } from "lucide-react";
import { PICTURE_URL } from "@/app/config/constant";

export function CompleteData({ id }) {
    const [data, setData] = useState({
        firstLoading: true,
        cities: [],
        city_id: '',
        bio: '',
        address: '',
        phones: '',
        visit_price_in_person: '',
        visit_price_text: '',
        visit_price_call: '',
        submitLoading: false
    });
    const [errors, setErrors] = useState({});

    const [image, setImage] = useState("");

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setImage(imageUrl);
            AxiosInstance.postForm('/utility/upload_profile',
                {
                    image: file
                }
            )
                .then(res => {
                    if (!res.data.error) {
                        AxiosInstance.postForm('/admin/add_profile_doctor', {
                            id: id,
                            picture_id: res.data.id
                        })
                            .then(res => {
                                addNotification('تصویر پروفایل بروزرسانی شد');
                            })
                            .catch(err => { })
                    }
                })
                .catch(err => { })
        }
    };

    useEffect(() => {
        if (id) {
            AxiosInstance.get('/utility/cities')
                .then((res) => {
                    setData((prevState) => ({
                        ...prevState,
                        cities: res.data.data
                    }))
                })
            AxiosInstance.get(`/admin/get_data_doctor/${id}`)
                .then((res) => {
                    if (!res.data.error) {
                        setData((prevState) => ({
                            ...prevState,
                            city_id: res.data?.data?.city_id || '',
                            bio: res.data?.data?.bio || '',
                            address: res.data?.data?.address || '',
                            phones: res.data?.data?.phones || '',
                            visit_price_in_person: res.data?.data?.visit_price_in_person || '',
                            visit_price_text: res.data?.data?.visit_price_text || '',
                            visit_price_call: res.data?.data?.visit_price_call || '',
                            firstLoading: false
                        }))
                        setImage(res.data?.data?.profile_image ? PICTURE_URL+res.data?.data?.profile_image : '')
                    }
                })
        }
    }, [id]);

    const validateField = (name, value) => {
        let error = "";
        if (!value) {
            error = "این فیلد نمی‌تواند خالی باشد";
        }
        setErrors(prev => ({ ...prev, [name]: error }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }));
        validateField(name, value);
    };

    const handleSelectChange = (name, value) => {
        setData(prev => ({ ...prev, [name]: value }));
        validateField(name, value);
    };

    const validateForm = () => {
        let errors = {};

        if (!data.bio) errors.bio = "بیو الزامی است";
        if (!data.address) errors.address = "آدرس الزامی است";
        if (!data.phones) errors.phones = "تلفن الزامی است";
        if (!data.visit_price_in_person) errors.visit_price_in_person = "ویزیت حضوری الزامی است";
        if (!data.city_id) errors.city_id = "شهر را انتخاب کنید.";

        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const submitForm = async () => {
        if (!validateForm()) return;

        setData((prevState) => ({ ...prevState, submitLoading: true }));
        let dataForm = new FormData();
        dataForm.append('id', id);
        dataForm.append('bio', data.bio);
        dataForm.append('address', data.address);
        dataForm.append('phones', data.phones);
        dataForm.append('visit_price_in_person', data.visit_price_in_person);
        dataForm.append('visit_price_text', data.visit_price_text);
        dataForm.append('visit_price_call', data.visit_price_call);
        dataForm.append('city_id', data.city_id);

        await AxiosInstance.post('/admin/complete_data_doctor', dataForm)
            .then(res => {
                if (!res.data.error) {
                    addNotification(res.data.message)
                }
            })
        setData((prevState) => ({ ...prevState, submitLoading: false }));
    };


    if (data.firstLoading) {
        return <div className="container mx-auto p-2">
            <div className="p-4 flex justify-center items-center min-h-24">
                <LoadingIcon width={'w-8'} />
            </div>
        </div>
    }

    return (
        <>
            <div className="flex flex-col items-center w-full mb-2">
                <label className="relative w-32 h-32 rounded-full overflow-hidden border-2 cursor-pointer">
                    <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                    {image ? (
                        <img src={image} alt="Doctor Profile" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <User className="w-10 h-10 text-gray-400" />
                        </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity">
                        <Camera className="text-white w-8 h-8" />
                    </div>
                </label>

            </div>

            {[
                { label: "بیو صفحه پزشک", name: "bio", mandatory: true },
                { label: "آدرس", name: "address", mandatory: true },
                { label: "تلفن(ها)", name: "phones", mandatory: true },
                { label: "هزینه ویزیت حضوری (ریال)", name: "visit_price_in_person", mandatory: true },
                { label: "هزینه ویزیت متنی (ریال)", name: "visit_price_text", mandatory: false },
                { label: "هزینه ویزیت تلفنی (ریال)", name: "visit_price_call", mandatory: false }
            ].map(({ label, name, type = "text", mandatory }) => (
                <div key={name} className="p-2">
                    <div className="mb-2 text-slate-700 text-sm ml-2">
                        {label} {mandatory && <sup className="text-red-500 font-bold">*</sup>}
                    </div>
                    <input
                        type={type}
                        name={name}
                        value={data[name] || ""}
                        onChange={handleChange}
                        className={`w-full border rounded-md p-2 bg-white outline-none text-sm text-slate-700 ${mandatory && errors[name] ? "border-red-500" : ""}`}
                    />
                    {mandatory && errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
                </div>
            ))}
            <div className="px-2 py-4">
                <div className="mb-2 text-slate-700 text-sm ml-2">شهر پزشک  <sup className="text-red-500 font-bold">*</sup></div>
                <DynamicSelect selectedOption={data.city_id || ""} options={data.cities} onSelect={(value) => handleSelectChange("city_id", value)} label={'شهر پزشک را انتخاب کنید'} />
                {errors.city_id && <p className="text-red-500 text-xs mt-1">{errors.city_id}</p>}
            </div>
            <div className="mt-3">
                <button disabled={data.submitLoading} onClick={submitForm} className="flex items-center justify-center w-full text-center border rounded-md p-3 text-white text-sm bg-violet-800 hover:bg-violet-900">
                    {
                        data.submitLoading ?
                            <LoadingButton />
                            :
                            <span>ثبت اطلاعات پروفایل</span>
                    }
                </button>
            </div>
        </>
    )
}