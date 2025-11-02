"use client";

import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from '@/components/ui/button'
import Link from "next/link";

export default function CallToAction() {
    return (
        <section className="py-16 md:py-32 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto">
                <div className="text-center">
                    <h2 className="text-balance text-4xl font-semibold lg:text-5xl">Ready to validate your idea?</h2>
                    <p className="mt-4">Join thousands of entrepreneurs who are using AI to validate and build their startup ideas</p>

                    <div className="mx-auto mt-10 w-full lg:mt-12">
                        <Button
                            asChild
                            size="lg"
                            className="w-full text-lg">
                            <Link href="/auth/signup">
                                Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}
