
package dev.shandeep.identitydetailstweaksplugin;

import sailpoint.rest.plugin.AllowAll;
import sailpoint.rest.plugin.BasePluginResource;
import sailpoint.api.SailPointContext;
import sailpoint.api.SailPointFactory;
import sailpoint.object.Capability;
import sailpoint.object.Identity;

import sailpoint.tools.Util;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;

/**
 * The REST resource for generating the announcement text from settings.
 *
 * @author Shandeep Srinivas <https://shandeep.dev>
 */
@Path("IdentityDetailsTweaks")
@Produces("application/json")
@Consumes("application/json")
public class GetConfiguration extends BasePluginResource {

    @Override
    public String getPluginName() {
        return "IdentityDetailsTweaks";
    }

    /**
     * Gets Announcement text from settings.
     *
     * @return The String containing the announcement.
     * @throws Exception
     */
    @GET
    @Path("getConfiguration")
    @AllowAll
    public Map<String, Object> getConfiguration() throws Exception {
        String appsToHide = getSettingString("appsToHide");
        String identityAttributesToHide = getSettingString("identityAttributesToHide");
        boolean disableDetailsActionButton = getSettingBool("disableDetailsActionButton");
        boolean disableEntLinks = getSettingBool("disableEntLinks");
        boolean isAdmin = isAdmin();
        Map<String, Object> result = new HashMap<String, Object>();
        result.put("appsToHide", appsToHide);
        result.put("identityAttributesToHide", identityAttributesToHide);
        result.put("disableDetailsActionButton", disableDetailsActionButton);
        result.put("disableEntLinks", disableEntLinks);
        result.put("isAdmin", isAdmin);
        return result;
    }

    private boolean isAdmin() throws Exception {
        SailPointContext context = SailPointFactory.getCurrentContext();
        Identity loggedInUser = context.getObjectByName(Identity.class, context.getUserName());
        List<String> capabilities = new ArrayList<>();
        loggedInUser.getCapabilityManager().getEffectiveCapabilities().stream()
                .forEach(i -> capabilities.add(i.getName()));
        List<String> allowedCapability = new ArrayList<>();
        allowedCapability.add(Capability.SYSTEM_ADMINISTRATOR);
        allowedCapability.add("IdentityDetailsTweaksAdmin");
        if (!Util.isEmpty(capabilities) && !Collections.disjoint(capabilities, allowedCapability)) {
            return true;
        }
        return false;
    }

}
