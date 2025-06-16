"use client";
import { resetPassword } from "@/lib/features/auth/authAPI";
import { coloredToast, successToast } from "@/utils/sweetAlerts";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useRouter, useSearchParams } from "next/navigation";
import { object, ref, string } from "yup";

const loginSchema = object({
  password: string()
    .required("This field is required.")
    .min(8, "At least 8 characters must be entered.")
    .max(16, "Maximum 16 characters must be entered.")
    .matches(/\d+/, "It must contain at least one digit.")
    .matches(/[a-z]/, "It must contain at least one lowercase letter.")
    .matches(/[A-Z]/, "It must contain at least one uppercase letter.")
    .matches(
      /[!,?{}><%&$#£+-.]+/,
      "It must contain at least one special character."
    ),
  password2: string()
    .required("Please confirm your password.")
    .oneOf([ref("password")], "Passwords must match."),
});

export default function ResetPassForm() {
  const searchParams = useSearchParams();

  const router = useRouter();

  const uid = searchParams.get("uid");
  const emailToken = searchParams.get("emailToken");
  const queries = {
    uid,
    emailToken,
  };

  return (
    <Formik
      initialValues={{ password: "", password2: "" }}
      validationSchema={loginSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        setTimeout(() => {
          resetPassword({ ...values, ...queries })
            .then((data) => {
              if (data?.error) {
                setSubmitting(false);
                resetForm();
                coloredToast("danger", data.error.trim());
              } else {
                successToast(data?.message);
                router.replace('/login')
                setSubmitting(false);
              }
            })
            .catch((error) => {
              setSubmitting(false);
              resetForm();
              coloredToast("danger", "Something went wrong.");
            });
        }, 500);
      }}
    >
      {({ touched, errors, isSubmitting, handleSubmit }) => (
        <Form>
          <div className="space-y-5">
            <div>
              <label htmlFor="password">New Password</label>
              <Field
                type="password"
                name="password"
                placeholder="Enter Password"
                className={`form-input placeholder:text-gray-400 ${
                  touched.password && errors.password ? "border-red-500" : ""
                }`}
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500 text-sm "
              />
            </div>
            <div>
              <label htmlFor="password">Confrim your new password</label>
              <Field
                type="password"
                name="password2"
                placeholder="Enter Password"
                className={`form-input placeholder:text-gray-400 ${
                  touched.password && errors.password ? "border-red-500" : ""
                }`}
              />
              <ErrorMessage
                name="password2"
                component="div"
                className="text-red-500 text-sm "
              />
            </div>
            <button type="submit" className="btn btn-primary w-full">
              {isSubmitting && (
                <span className="animate-spin border-2 border-white border-l-transparent rounded-full w-5 h-5 ltr:mr-4 rtl:ml-4 inline-block align-middle mr-4"></span>
              )}
              {isSubmitting ? "LOADING.." : "Update Password"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
