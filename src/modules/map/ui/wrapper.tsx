"use client";

// * React and Next:
import { ReactNode } from "react"

// * Translations:
import { useTranslation } from "react-i18next";

// * UI:
import "../map.css";
import { 
    Card,
    CardContent,
    CardHeader,
    CardAction, 
    CardTitle,
    CardDescription
} from "@/ui/components/card";
import { Button } from "@/ui/components/button";

export function Wrapper(
    { fullScreen, children }: 
    { fullScreen: boolean, children: ReactNode }
) {

    const { t } = useTranslation();

    if(!fullScreen) {
        return (
            <Card className="map-card">
                <CardHeader>
                    <CardTitle>{t('modules_map_card_title')}</CardTitle>
                    <CardDescription>{t('modules_map_card_description')}</CardDescription>
                </CardHeader>
                <CardContent className="map-card-content">
                    {children}
                </CardContent>
                <CardAction>
                    <Button>
                        {t('modules_map_card_action')}
                    </Button>
                </CardAction>
            </Card>
        )
    }

    return (
        <div className="map-wrapper">
            {children}
        </div>
    )
}
