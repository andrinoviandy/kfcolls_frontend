import { swal } from "global/helper/swal";
import storeSchema from "global/store";
import React, { useState } from "react";

import {
    IoLockClosed,
    IoPerson,
    IoEye,
    IoEyeOff,
    IoShieldCheckmark,
    IoCheckmarkCircle,
} from "react-icons/io5";

export default function ResetPassword({ dataUser }) {
    const [formData, setFormData] = useState({
        identifier: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(false);

    const [showPassword, setShowPassword] = useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    // =====================================================
    // HANDLE CHANGE
    // =====================================================

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    // =====================================================
    // HANDLE SUBMIT
    // =====================================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            formData.newPassword === "" ||
            formData.confirmPassword === ""
        ) {
            swal.warning(
                "Password baru dan Konfirmasi Password wajib terisi."
            );

            return;
        }

        if (
            formData.newPassword !==
            formData.confirmPassword
        ) {
            swal.warning(
                "Password baru dan Konfirmasi Password harus sama."
            );

            return;
        }

        try {
            setLoading(true);

            swal.loading();

            const res =
                await storeSchema.actions.updatePassword({
                    identifier: dataUser?.username,
                    password: formData.newPassword,
                });

            if (res?.status) {
                setFormData({
                    identifier: "",
                    newPassword: "",
                    confirmPassword: "",
                });

                setShowPassword(false);
                setShowConfirmPassword(false);

                swal.success(
                    "Password Berhasil Diubah !"
                );
            } else {
                swal.error(
                    "Password Gagal Diubah !"
                );
            }
        } catch (error) {
            console.error(
                "ERROR UPDATE PASSWORD:",
                error
            );

            swal.error(
                "Terjadi kesalahan saat menghubungi server."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full">

            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <div className="
                flex
                flex-col
                sm:flex-row
                sm:items-center
                sm:justify-between
                gap-4
                mb-7
            ">

                {/* TITLE */}

                <div className="
                    flex
                    items-center
                    gap-4
                ">

                    {/* ICON */}

                    <div className="
                        relative
                        w-14
                        h-14
                        rounded-2xl
                        bg-blue-600
                        flex
                        items-center
                        justify-center
                        shadow-md
                        shadow-blue-600/20
                        shrink-0
                    ">

                        <IoShieldCheckmark
                            className="
                                text-3xl
                                text-white
                            "
                        />

                        {/* ORANGE DOT */}

                        <div className="
                            absolute
                            -top-1
                            -right-1
                            w-5
                            h-5
                            rounded-full
                            bg-orange-500
                            border-2
                            border-white"
                        />

                    </div>


                    {/* TEXT */}

                    <div>

                        <h2 className="
                            text-xl
                            lg:text-2xl
                            font-bold
                            text-gray-800
                        ">
                            Perubahan Password
                        </h2>

                        <p className="
                            text-sm
                            text-gray-500
                            mt-1
                        ">
                            Ubah password kamu secara berkala
                        </p>

                    </div>

                </div>


                {/* SECURITY BADGE */}

                <div className="
                    hidden
                    sm:flex
                    items-center
                    gap-2
                    px-4
                    py-2
                    rounded-full
                    bg-green-50
                    border
                    border-green-100
                    text-green-600
                    text-xs
                    font-semibold
                ">

                    <IoCheckmarkCircle
                        className="text-lg"
                    />

                    Akun Terlindungi

                </div>

            </div>


            {/* ================================================= */}
            {/* SECURITY INFORMATION */}
            {/* ================================================= */}

            <div className="
                mb-6
                p-4
                rounded-2xl
                bg-orange-50
                border
                border-orange-100
                flex
                items-start
                gap-3
            ">

                <div className="
                    w-10
                    h-10
                    rounded-xl
                    bg-orange-100
                    flex
                    items-center
                    justify-center
                    shrink-0
                ">

                    <IoShieldCheckmark
                        className="
                            text-xl
                            text-orange-500
                        "
                    />

                </div>


                <div>

                    <p className="
                        text-sm
                        font-semibold
                        text-gray-800
                    ">
                        Tips Keamanan
                    </p>

                    <p className="
                        text-xs
                        text-gray-500
                        mt-1
                        leading-relaxed
                    ">
                        Gunakan password yang kuat dan
                        jangan gunakan password yang sama
                        dengan akun lainnya.
                    </p>

                </div>

            </div>


            {/* ================================================= */}
            {/* FORM CARD */}
            {/* ================================================= */}

            <div className="
                rounded-3xl
                border
                border-gray-100
                bg-white
                shadow-sm
                overflow-hidden
            ">

                {/* ================================================= */}
                {/* CARD HEADER */}
                {/* ================================================= */}

                <div className="
                    px-5
                    sm:px-6
                    py-5
                    border-b
                    border-gray-100
                    bg-gray-50/70
                ">

                    <div className="
                        flex
                        items-center
                        gap-3
                    ">

                        <div className="
                            w-10
                            h-10
                            rounded-xl
                            bg-blue-50
                            flex
                            items-center
                            justify-center
                        ">

                            <IoLockClosed
                                className="
                                    text-xl
                                    text-blue-600
                                "
                            />

                        </div>


                        <div>

                            <h3 className="
                                font-bold
                                text-gray-800
                            ">
                                Keamanan Akun
                            </h3>

                            <p className="
                                text-xs
                                text-gray-500
                                mt-0.5
                            ">
                                Perbarui password akun kamu
                            </p>

                        </div>

                    </div>

                </div>


                {/* ================================================= */}
                {/* FORM */}
                {/* ================================================= */}

                <form
                    onSubmit={handleSubmit}
                    className="
                        p-5
                        sm:p-6
                        space-y-6
                    "
                >

                    {/* ================================================= */}
                    {/* USERNAME */}
                    {/* ================================================= */}

                    <div>

                        <label className="
                            block
                            text-sm
                            font-semibold
                            text-gray-700
                            mb-2
                        ">
                            Username
                        </label>

                        <div className="relative">

                            <div className="
                                absolute
                                left-4
                                top-1/2
                                -translate-y-1/2
                                w-9
                                h-9
                                rounded-xl
                                bg-blue-50
                                flex
                                items-center
                                justify-center
                                text-blue-600
                            ">

                                <IoPerson
                                    className="text-lg"
                                />

                            </div>


                            <input
                                type="text"
                                name="identifier"
                                value={
                                    dataUser?.username ||
                                    ""
                                }
                                disabled
                                className="
                                    w-full
                                    pl-16
                                    pr-4
                                    py-3.5
                                    rounded-2xl
                                    border
                                    border-gray-200
                                    bg-gray-100
                                    text-gray-500
                                    text-sm
                                    font-medium
                                    outline-none
                                    cursor-not-allowed
                                "
                            />

                        </div>


                        <p className="
                            text-xs
                            text-gray-400
                            mt-2
                        ">
                            Username tidak dapat diubah
                            dari halaman ini.
                        </p>

                    </div>


                    {/* ================================================= */}
                    {/* PASSWORD BARU */}
                    {/* ================================================= */}

                    <div>

                        <label className="
                            block
                            text-sm
                            font-semibold
                            text-gray-700
                            mb-2
                        ">
                            Password Baru
                        </label>

                        <div className="relative">

                            {/* ICON */}

                            <div className="
                                absolute
                                left-4
                                top-1/2
                                -translate-y-1/2
                                w-9
                                h-9
                                rounded-xl
                                bg-blue-50
                                flex
                                items-center
                                justify-center
                                text-blue-600
                            ">

                                <IoLockClosed
                                    className="text-lg"
                                />

                            </div>


                            {/* INPUT */}

                            <input
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                name="newPassword"
                                value={
                                    formData.newPassword
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Masukkan password baru"
                                className="
                                    w-full
                                    pl-16
                                    pr-14
                                    py-3.5
                                    rounded-2xl
                                    border
                                    border-gray-200
                                    bg-white
                                    text-gray-700
                                    text-sm
                                    placeholder:text-gray-400
                                    outline-none
                                    transition-all
                                    duration-300
                                    focus:border-blue-500
                                    focus:ring-4
                                    focus:ring-blue-500/10
                                "
                                required
                            />


                            {/* SHOW PASSWORD */}

                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword(
                                        !showPassword
                                    )
                                }
                                className="
                                    absolute
                                    right-3
                                    top-1/2
                                    -translate-y-1/2
                                    w-10
                                    h-10
                                    rounded-xl
                                    flex
                                    items-center
                                    justify-center
                                    text-gray-400
                                    hover:text-blue-600
                                    hover:bg-blue-50
                                    transition-all
                                "
                            >

                                {showPassword ? (
                                    <IoEyeOff
                                        className="text-xl"
                                    />
                                ) : (
                                    <IoEye
                                        className="text-xl"
                                    />
                                )}

                            </button>

                        </div>

                    </div>


                    {/* ================================================= */}
                    {/* CONFIRM PASSWORD */}
                    {/* ================================================= */}

                    <div>

                        <label className="
                            block
                            text-sm
                            font-semibold
                            text-gray-700
                            mb-2
                        ">
                            Konfirmasi Password Baru
                        </label>

                        <div className="relative">

                            {/* ICON */}

                            <div className="
                                absolute
                                left-4
                                top-1/2
                                -translate-y-1/2
                                w-9
                                h-9
                                rounded-xl
                                bg-blue-50
                                flex
                                items-center
                                justify-center
                                text-blue-600
                            ">

                                <IoLockClosed
                                    className="text-lg"
                                />

                            </div>


                            {/* INPUT */}

                            <input
                                type={
                                    showConfirmPassword
                                        ? "text"
                                        : "password"
                                }
                                name="confirmPassword"
                                value={
                                    formData.confirmPassword
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Konfirmasi password baru"
                                className="
                                    w-full
                                    pl-16
                                    pr-14
                                    py-3.5
                                    rounded-2xl
                                    border
                                    border-gray-200
                                    bg-white
                                    text-gray-700
                                    text-sm
                                    placeholder:text-gray-400
                                    outline-none
                                    transition-all
                                    duration-300
                                    focus:border-blue-500
                                    focus:ring-4
                                    focus:ring-blue-500/10
                                "
                                required
                            />


                            {/* SHOW PASSWORD */}

                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirmPassword(
                                        !showConfirmPassword
                                    )
                                }
                                className="
                                    absolute
                                    right-3
                                    top-1/2
                                    -translate-y-1/2
                                    w-10
                                    h-10
                                    rounded-xl
                                    flex
                                    items-center
                                    justify-center
                                    text-gray-400
                                    hover:text-blue-600
                                    hover:bg-blue-50
                                    transition-all
                                "
                            >

                                {showConfirmPassword ? (
                                    <IoEyeOff
                                        className="text-xl"
                                    />
                                ) : (
                                    <IoEye
                                        className="text-xl"
                                    />
                                )}

                            </button>

                        </div>


                        {/* PASSWORD MATCH */}

                        {formData.confirmPassword && (
                            <div
                                className={`
                                    flex
                                    items-center
                                    gap-2
                                    mt-2
                                    text-xs
                                    font-medium
                                    ${
                                        formData.newPassword ===
                                        formData.confirmPassword
                                            ? "text-green-600"
                                            : "text-red-500"
                                    }
                                `}
                            >

                                <IoCheckmarkCircle
                                    className="text-sm"
                                />

                                {formData.newPassword ===
                                formData.confirmPassword
                                    ? "Password sudah sama"
                                    : "Password belum sama"}

                            </div>
                        )}

                    </div>


                    {/* ================================================= */}
                    {/* BUTTON */}
                    {/* ================================================= */}

                    <div className="
                        pt-2
                        border-t
                        border-gray-100
                    ">

                        <button
                            type="submit"
                            disabled={loading}
                            className="
                                w-full
                                bg-blue-600
                                hover:bg-blue-700
                                active:bg-blue-800
                                text-white
                                py-3.5
                                rounded-2xl
                                font-semibold
                                text-sm
                                shadow-md
                                shadow-blue-600/20
                                hover:shadow-blue-600/30
                                transition-all
                                duration-300
                                flex
                                items-center
                                justify-center
                                gap-3
                                disabled:opacity-60
                                disabled:cursor-not-allowed
                            "
                        >

                            {loading ? (
                                <>
                                    <span
                                        className="
                                            loading
                                            loading-spinner
                                            loading-sm
                                        "
                                    />

                                    Memperbarui Password...
                                </>
                            ) : (
                                <>
                                    <IoShieldCheckmark
                                        className="text-xl"
                                    />

                                    Simpan Perubahan
                                </>
                            )}

                        </button>

                    </div>

                </form>

            </div>


            {/* ================================================= */}
            {/* FOOTER */}
            {/* ================================================= */}

            <div className="
                flex
                items-center
                justify-center
                gap-2
                mt-5
                text-xs
                text-gray-400
            ">

                <IoShieldCheckmark />

                Pastikan password kamu selalu
                terjaga dengan baik.

            </div>

        </div>
    );
}